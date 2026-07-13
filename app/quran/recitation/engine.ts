/**
 * Recitation tracker: aligns a growing speech transcript against the mushaf
 * word index. Works like a follow-along engine (Tarteel-style):
 *
 *  - searching: buffer spoken words, locate them globally via an inverted
 *    index + fuzzy sequence alignment. Locks only when one location clearly
 *    wins (guards against the Quran's many repeated phrases).
 *  - locked: follow word-by-word within a small lookahead window; tolerate
 *    recognition noise; consume isti'adha/basmallah silently; after several
 *    consecutive misses fall back to searching (reciter jumped elsewhere).
 *
 * The tracker is fed the full final transcript plus the volatile interim
 * tail on every recognition event. Final words advance persistent state;
 * interim words are applied to a throwaway copy so their churn never
 * corrupts tracking.
 */

import { isWordMatch, tokenizeArabic, wordSimilarity } from "./arabic";
import type { AyahInfo, IndexedWord, RecitationIndex } from "./indexer";
import { ayahKey } from "./indexer";

export type TrackerPhase = "searching" | "locked";

export interface TrackerResult {
  phase: TrackerPhase;
  word: IndexedWord | null;
  ayah: AyahInfo | null;
}

const LOOKAHEAD = 10; // follow-mode window size (words ahead of anchor)
const MAX_MISSES = 5; // consecutive misses before falling back to search
const SEARCH_BUF_MAX = 10;
const MISS_BUF_MAX = 8;
const MIN_LOCK_MATCHES = 3;
const MIN_LOCK_RATIO = 0.6; // aligned fraction of buffered words
const MIN_LOCK_AVG_SIM = 0.72;
const LOCK_MARGIN = 0.12; // required lead over 2nd-best location
const SEED_DF_CAP = 700; // words more frequent than this don't seed search
const CANDIDATE_CAP = 6000;
const ALIGN_SKIP = 2; // index words the aligner may hop over per spoken word
const SAME_REGION_SEQS = 8; // candidates this close are the same location
// Cold-start prior: people overwhelmingly start reciting at a surah opening,
// which disambiguates phrases like الحمد لله رب العالمين (Fatiha vs 5 other
// verbatim occurrences deep inside other suwar).
const SURAH_OPENING_BONUS_NEAR = 0.13; // within ~8 words of a surah start
const SURAH_OPENING_BONUS_MID = 0.06; // within ~20 words

// Recited before/between suwar but not part of the followed text. Spoken
// forms (standard orthography); matched fuzzily, consumed silently.
const SKIP_PHRASES: string[][] = [
  ["اعوذ", "بالله", "من", "الشيطان", "الرجيم"],
  ["بسم", "الله", "الرحمن", "الرحيم"],
];

interface SkipProgress {
  phrase: number;
  pos: number;
}

interface TrackerState {
  phase: TrackerPhase;
  /** seq of the last matched word (locked mode). */
  anchor: number;
  misses: number;
  missBuf: string[];
  searchBuf: string[];
  skip: SkipProgress | null;
  /** Last confidently known position, used to prefer nearby candidates. */
  lastKnownSeq: number | null;
}

interface CandidateScore {
  start: number;
  matched: number;
  ratio: number;
  avgSim: number;
  firstMatchedSeq: number;
  lastMatchedSeq: number;
  score: number;
}

function initialState(): TrackerState {
  return {
    phase: "searching",
    anchor: -1,
    misses: 0,
    missBuf: [],
    searchBuf: [],
    skip: null,
    lastKnownSeq: null,
  };
}

function cloneState(s: TrackerState): TrackerState {
  return {
    ...s,
    missBuf: [...s.missBuf],
    searchBuf: [...s.searchBuf],
    skip: s.skip ? { ...s.skip } : null,
  };
}

export class RecitationTracker {
  private index: RecitationIndex;
  private state: TrackerState = initialState();
  private consumedFinalWords = 0;
  /** surah number -> seq of its first word. */
  private surahStartSeq = new Map<number, number>();

  constructor(index: RecitationIndex) {
    this.index = index;
    for (const w of index.words) {
      if (!this.surahStartSeq.has(w.surah)) {
        this.surahStartSeq.set(w.surah, w.seq);
      }
    }
  }

  reset(): void {
    this.state = initialState();
    this.consumedFinalWords = 0;
  }

  /**
   * Feed the full final transcript (append-only across the session) and the
   * current interim tail. Returns the tracker's best position estimate.
   */
  feed(finalText: string, interimText: string): TrackerResult {
    const finalWords = tokenizeArabic(finalText);
    for (let i = this.consumedFinalWords; i < finalWords.length; i++) {
      this.step(this.state, finalWords[i]);
    }
    this.consumedFinalWords = finalWords.length;

    let effective = this.state;
    const interimWords = interimText ? tokenizeArabic(interimText) : [];
    if (interimWords.length > 0) {
      effective = cloneState(this.state);
      for (const w of interimWords) this.step(effective, w);
    }
    return this.result(effective);
  }

  private result(s: TrackerState): TrackerResult {
    if (s.phase === "locked" && s.anchor >= 0) {
      const word = this.index.words[s.anchor];
      const ayah =
        this.index.ayahByKey.get(ayahKey(word.surah, word.ayah)) ?? null;
      return { phase: "locked", word, ayah };
    }
    return { phase: "searching", word: null, ayah: null };
  }

  private step(s: TrackerState, w: string): void {
    if (s.phase === "locked") {
      if (this.tryFollow(s, w)) return;
      if (this.trySkipPhrase(s, w, false)) return;
      s.misses++;
      s.missBuf.push(w);
      if (s.missBuf.length > MISS_BUF_MAX) s.missBuf.shift();
      if (s.misses >= MAX_MISSES) {
        s.phase = "searching";
        s.lastKnownSeq = s.anchor;
        s.searchBuf = [...s.missBuf];
        s.missBuf = [];
        s.misses = 0;
        this.attemptLock(s);
      }
      return;
    }

    // searching
    if (this.trySkipPhrase(s, w, s.searchBuf.length === 0)) return;
    s.searchBuf.push(w);
    if (s.searchBuf.length > SEARCH_BUF_MAX) s.searchBuf.shift();
    this.attemptLock(s);
  }

  /** Follow mode: match against the next few index words. */
  private tryFollow(s: TrackerState, w: string): boolean {
    const words = this.index.words;
    const from = s.anchor + 1;
    const to = Math.min(s.anchor + LOOKAHEAD, words.length - 1);
    for (let j = from; j <= to; j++) {
      if (isWordMatch(w, words[j].norm)) {
        s.anchor = j;
        s.misses = 0;
        s.missBuf = [];
        s.skip = null;
        return true;
      }
    }
    // Recognizers occasionally emit the same word twice (elongations);
    // allow an exact re-match of the current word without advancing.
    if (s.anchor >= 0 && words[s.anchor].norm === w) {
      s.misses = 0;
      return true;
    }
    return false;
  }

  /**
   * Advance through isti'adha/basmallah. New phrases may only begin when
   * `allowStart` (idle search) or while one is already in progress — never
   * mid-content, so ayah words like اعوذ (Al-Falaq) aren't swallowed.
   */
  private trySkipPhrase(
    s: TrackerState,
    w: string,
    allowStart: boolean
  ): boolean {
    if (s.skip) {
      const phrase = SKIP_PHRASES[s.skip.phrase];
      if (isWordMatch(w, phrase[s.skip.pos])) {
        s.skip.pos++;
        if (s.skip.pos >= phrase.length) s.skip = null;
        return true;
      }
      s.skip = null;
      // fall through: maybe this word starts the other phrase
    } else if (!allowStart) {
      return false;
    }
    for (let p = 0; p < SKIP_PHRASES.length; p++) {
      if (isWordMatch(w, SKIP_PHRASES[p][0])) {
        s.skip = { phrase: p, pos: 1 };
        return true;
      }
    }
    return false;
  }

  /** Global search: try to locate the buffered words in the mushaf. */
  private attemptLock(s: TrackerState): void {
    const buf = s.searchBuf;
    if (buf.length < MIN_LOCK_MATCHES) return;

    const candidates = this.collectCandidates(buf);
    if (candidates.size === 0) return;

    const scored: CandidateScore[] = [];
    for (const start of candidates) {
      const cand = this.alignAt(buf, start);
      if (cand) scored.push(cand);
    }
    if (scored.length === 0) return;

    // Different candidate starts can align onto the same words (junk offsets
    // shift the start), so location identity is the first matched seq.
    let best = scored[0];
    for (const cand of scored) {
      if (this.adjustedScore(s, cand) > this.adjustedScore(s, best)) {
        best = cand;
      }
    }
    if (
      best.matched < MIN_LOCK_MATCHES ||
      best.ratio < MIN_LOCK_RATIO ||
      best.avgSim < MIN_LOCK_AVG_SIM
    ) {
      return;
    }
    let second: CandidateScore | null = null;
    for (const cand of scored) {
      if (
        Math.abs(cand.firstMatchedSeq - best.firstMatchedSeq) >
          SAME_REGION_SEQS &&
        (!second || this.adjustedScore(s, cand) > this.adjustedScore(s, second))
      ) {
        second = cand;
      }
    }
    if (
      second &&
      this.adjustedScore(s, best) - this.adjustedScore(s, second) < LOCK_MARGIN
    ) {
      return; // ambiguous (repeated phrase) — wait for more words
    }

    s.phase = "locked";
    s.anchor = best.lastMatchedSeq;
    s.lastKnownSeq = best.lastMatchedSeq;
    s.misses = 0;
    s.missBuf = [];
    s.searchBuf = [];
    s.skip = null;
  }

  /**
   * Candidate score plus context priors: proximity to the last known
   * position while re-locating, or the surah-opening prior on a cold start.
   */
  private adjustedScore(s: TrackerState, cand: CandidateScore): number {
    if (s.lastKnownSeq !== null) {
      const d = Math.abs(cand.firstMatchedSeq - s.lastKnownSeq);
      return cand.score + 0.1 * Math.exp(-d / 1500);
    }
    const word = this.index.words[cand.firstMatchedSeq];
    const surahStart = this.surahStartSeq.get(word.surah);
    if (surahStart !== undefined) {
      const d = cand.firstMatchedSeq - surahStart;
      if (d <= 8) return cand.score + SURAH_OPENING_BONUS_NEAR;
      if (d <= 20) return cand.score + SURAH_OPENING_BONUS_MID;
    }
    return cand.score;
  }

  private collectCandidates(buf: string[]): Set<number> {
    const { positionsByNorm } = this.index;
    const candidates = new Set<number>();
    // Seed from the rarest words first so the cap keeps the best seeds.
    const seeds = buf
      .map((w, i) => ({ w, i, df: positionsByNorm.get(w)?.length ?? 0 }))
      .filter((x) => x.df > 0 && x.df <= SEED_DF_CAP)
      .sort((a, b) => a.df - b.df);
    for (const { w, i } of seeds) {
      const seqs = positionsByNorm.get(w)!;
      for (const seq of seqs) {
        const start = seq - i;
        candidates.add(start < 0 ? 0 : start);
        if (candidates.size >= CANDIDATE_CAP) return candidates;
      }
    }
    return candidates;
  }

  /** Greedy alignment of the buffer against index words from `start`. */
  private alignAt(buf: string[], start: number): CandidateScore | null {
    const words = this.index.words;
    if (start >= words.length) return null;
    let cursor = start;
    let matched = 0;
    let simSum = 0;
    let firstMatchedSeq = -1;
    let lastMatchedSeq = -1;
    for (const w of buf) {
      // Leading junk (muqatta'at read letter-by-letter, noise) shifts the
      // reconstructed start, so the first match scans a wide window; after
      // that the alignment is tight.
      const span = matched === 0 ? buf.length + 3 : ALIGN_SKIP;
      const limit = Math.min(cursor + span, words.length - 1);
      for (let j = cursor; j <= limit; j++) {
        if (isWordMatch(w, words[j].norm)) {
          matched++;
          simSum += wordSimilarity(w, words[j].norm);
          if (firstMatchedSeq < 0) firstMatchedSeq = j;
          lastMatchedSeq = j;
          cursor = j + 1;
          break;
        }
      }
      // unmatched spoken word: treat as noise, cursor stays
    }
    if (matched === 0) return null;
    const ratio = matched / buf.length;
    const avgSim = simSum / matched;
    return {
      start,
      matched,
      ratio,
      avgSim,
      firstMatchedSeq,
      lastMatchedSeq,
      score: ratio * avgSim,
    };
  }
}

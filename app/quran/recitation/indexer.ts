/**
 * Builds a word-level recitation index from the mushaf page data served by
 * /api/quran. Works on the raw html_content strings with regexes (the data
 * is machine-generated and uniform), so it runs in node and in the browser
 * without a DOM.
 *
 * Word ids mirror the mushaf's own numbering: each line's spans (words AND
 * ayah-number markers, in document order) are numbered sequentially from the
 * line's data-first-word-id. The reader page computes the same ids when
 * rendering, which is what lets the engine target specific spans for
 * highlighting.
 */

import { normalizeArabicWord } from "./arabic";

export interface QuranPagesData {
  [pageNumber: string]: { html_content: string };
}

export interface IndexedWord {
  /** Position in the words array (mushaf reading order, markers excluded). */
  seq: number;
  /** Global mushaf span id (words + markers), used for highlighting. */
  id: number;
  /** Normalized skeleton text used for matching. */
  norm: string;
  surah: number;
  ayah: number;
  page: number;
}

export interface AyahInfo {
  surah: number;
  ayah: number;
  /** Page where the ayah starts. */
  page: number;
  startSeq: number;
  endSeq: number;
  /** Span id range covering the ayah's words and its number marker. */
  startId: number;
  endId: number;
}

export interface RecitationIndex {
  words: IndexedWord[];
  ayahs: AyahInfo[];
  ayahByKey: Map<string, AyahInfo>;
  /** normalized word -> seqs where it occurs (for search seeding). */
  positionsByNorm: Map<string, number[]>;
}

export function ayahKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

const TOKEN_RE =
  /<span class=['"]surah-name-v4 me-2['"]>surah(\d+)<\/span>|<p class=['"]quran-line[^>]*?data-first-word-id=['"](\d+)['"][^>]*?>|<span class="word[^"]*"[^>]*><span class="text"[^>]*>([^<]*)<\/span><\/span>|<span class="arabic-num-marker"[^>]*>([^<]*)<\/span>/g;

function parseArabicIndicNumber(text: string): number | null {
  let value = 0;
  let sawDigit = false;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) {
      value = value * 10 + (code - 0x0660);
      sawDigit = true;
    } else if (code >= 0x06f0 && code <= 0x06f9) {
      value = value * 10 + (code - 0x06f0);
      sawDigit = true;
    }
  }
  return sawDigit ? value : null;
}

export function buildRecitationIndex(pages: QuranPagesData): RecitationIndex {
  const words: IndexedWord[] = [];
  const ayahs: AyahInfo[] = [];
  const ayahByKey = new Map<string, AyahInfo>();
  const positionsByNorm = new Map<string, number[]>();

  let currentSurah = 0;
  let currentId = 0;
  // Words seen since the last ayah marker; they belong to the next marker's
  // ayah. May span page boundaries.
  let pending: { norm: string; id: number; page: number }[] = [];

  const pushWord = (norm: string, id: number, page: number) => {
    if (norm) pending.push({ norm, id, page });
  };

  const flushAyah = (ayahNumber: number, markerId: number) => {
    if (pending.length === 0) return;
    const startSeq = words.length;
    for (const w of pending) {
      const seq = words.length;
      words.push({
        seq,
        id: w.id,
        norm: w.norm,
        surah: currentSurah,
        ayah: ayahNumber,
        page: w.page,
      });
      const positions = positionsByNorm.get(w.norm);
      if (positions) positions.push(seq);
      else positionsByNorm.set(w.norm, [seq]);
    }
    const info: AyahInfo = {
      surah: currentSurah,
      ayah: ayahNumber,
      page: pending[0].page,
      startSeq,
      endSeq: words.length - 1,
      startId: pending[0].id,
      endId: markerId,
    };
    ayahs.push(info);
    ayahByKey.set(ayahKey(currentSurah, ayahNumber), info);
    pending = [];
  };

  const pageNumbers = Object.keys(pages)
    .map((p) => parseInt(p, 10))
    .filter((p) => !isNaN(p))
    .sort((a, b) => a - b);

  for (const pageNum of pageNumbers) {
    const html = pages[String(pageNum)]?.html_content;
    if (!html) continue;
    TOKEN_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TOKEN_RE.exec(html)) !== null) {
      const [, surahNum, firstWordId, wordText, markerText] = m;
      if (surahNum !== undefined) {
        currentSurah = parseInt(surahNum, 10);
      } else if (firstWordId !== undefined) {
        currentId = parseInt(firstWordId, 10);
      } else if (wordText !== undefined) {
        const norm = normalizeArabicWord(wordText);
        // Spans holding only waqf/ornament marks (ۖ ۚ ۞ ۩ ...) carry no
        // letters and do not consume a word id in the mushaf numbering.
        if (norm) {
          pushWord(norm, currentId, pageNum);
          currentId++;
        }
      } else if (markerText !== undefined) {
        const markerId = currentId;
        currentId++;
        const ayahNumber = parseArabicIndicNumber(markerText);
        if (ayahNumber === null) continue; // decorative marker (۞ etc.)
        flushAyah(ayahNumber, markerId);
        // Rare data quirk: the next ayah's first word glued after the
        // digits inside the marker span (e.g. "٢٤٣مَّن"). Keep it as a
        // word of the next ayah, sharing the marker's span id.
        const trailing = normalizeArabicWord(markerText);
        if (trailing) pushWord(trailing, markerId, pageNum);
      }
    }
  }

  return { words, ayahs, ayahByKey, positionsByNorm };
}

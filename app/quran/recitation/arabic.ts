/**
 * Arabic text normalization and fuzzy matching utilities for recitation
 * following. Maps both Uthmani-script mushaf text and speech-recognition
 * output (standard orthography) into a common skeleton so they can be
 * compared word-by-word.
 */

// Characters mapped to a plain-letter equivalent before stripping marks.
// Dagger alef (U+0670) and small waw/yeh represent full long vowels in the
// Uthmani script (e.g. ٱلصِّرَٰطَ -> الصراط), so they become real letters
// rather than being dropped.
const CHAR_MAP: Record<string, string> = {
  "آ": "ا", // آ  alef madda -> alef
  "أ": "ا", // أ  alef hamza above -> alef
  "إ": "ا", // إ  alef hamza below -> alef
  "ٱ": "ا", // ٱ  alef wasla -> alef
  "ٲ": "ا", // ٲ  alef wavy hamza above -> alef
  "ٳ": "ا", // ٳ  alef wavy hamza below -> alef
  "ٰ": "ا", // ٰ  dagger alef -> alef
  "ؤ": "و", // ؤ  waw hamza -> waw
  "ۥ": "و", // ۥ  small waw -> waw
  "ئ": "ي", // ئ  yeh hamza -> yeh
  "ى": "ي", // ى  alef maqsura -> yeh
  "ی": "ي", // ی  farsi yeh -> yeh
  "ۦ": "ي", // ۦ  small yeh -> yeh
  "ۧ": "ي", // ۧ  small high yeh -> yeh (e.g. إبرٰهـۧم)
  "ۨ": "ن", // ۨ  small high noon -> noon (e.g. نـۨجي)
  "ة": "ه", // ة  ta marbuta -> ha
  "ک": "ك", // ک  keheh -> kaf
  "ء": "", // ء  standalone hamza dropped
  "ـ": "", // ـ  tatweel dropped
};

// Arabic letters we keep after mapping (the base alphabet block).
const KEEP_RE = /[ا-ي]/;

/**
 * Normalize an Arabic word (or phrase) to a diacritic-free skeleton in
 * standard orthography. Anything that is not an Arabic letter after
 * mapping (harakat, quranic annotation signs, digits, latin, punctuation)
 * is removed. Whitespace is NOT preserved — use tokenizeArabic for text.
 */
export function normalizeArabicWord(input: string): string {
  let out = "";
  for (const ch of input) {
    const mapped = CHAR_MAP[ch];
    if (mapped !== undefined) {
      out += mapped;
      continue;
    }
    if (KEEP_RE.test(ch)) {
      out += ch;
    }
    // everything else (tashkeel, quranic marks, digits, symbols) dropped
  }
  return out;
}

/** Split free text into normalized, non-empty word tokens. */
export function tokenizeArabic(text: string): string[] {
  const tokens: string[] = [];
  for (const raw of text.split(/\s+/)) {
    const norm = normalizeArabicWord(raw);
    if (norm) tokens.push(norm);
  }
  return tokens;
}

/** Classic Levenshtein distance (iterative, two-row). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  let prev = new Array<number>(lb + 1);
  let curr = new Array<number>(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= lb; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[lb];
}

/** Similarity in [0,1] between two normalized words. */
export function wordSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const m = Math.max(a.length, b.length);
  if (m === 0) return 0;
  return 1 - levenshtein(a, b) / m;
}

/**
 * Whether a spoken word is an acceptable match for an expected word.
 * Tolerance scales with length; very short words must match exactly to
 * avoid noise from common particles (من/ما/لا...).
 */
export function isWordMatch(spoken: string, expected: string): boolean {
  if (spoken === expected) return true;
  const m = Math.max(spoken.length, expected.length);
  if (m <= 3) return false; // short words: exact only
  const dist = levenshtein(spoken, expected);
  if (m <= 6) return dist <= 1;
  if (m <= 9) return dist <= 2;
  return dist <= 3;
}

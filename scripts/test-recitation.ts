/**
 * Recitation follow-along test suite. Runs against the real mushaf data in
 * app/quran/data, exercising the normalizer, indexer and tracking engine
 * with speech-recognition-style transcripts (standard orthography, noise,
 * interim churn).
 *
 *   pnpm test:recitation
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  normalizeArabicWord,
  tokenizeArabic,
  levenshtein,
  isWordMatch,
} from "../app/quran/recitation/arabic";
import {
  buildRecitationIndex,
  ayahKey,
  type RecitationIndex,
} from "../app/quran/recitation/indexer";
import {
  RecitationTracker,
  type TrackerResult,
} from "../app/quran/recitation/engine";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "app", "quran", "data");

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    const msg = `  ✗ ${name}${detail ? ` — ${detail}` : ""}`;
    failures.push(msg);
    console.error(msg);
  }
}

function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

function loadPages(file: string) {
  const raw = readFileSync(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(raw).pages;
}

function fmt(r: TrackerResult): string {
  if (r.phase !== "locked" || !r.word) return "searching";
  return `${r.word.surah}:${r.word.ayah} (page ${r.word.page}, seq ${r.word.seq})`;
}

/** Feed a transcript to a fresh tracker word-by-word as final text. */
function recite(index: RecitationIndex, text: string): TrackerResult {
  const tracker = new RecitationTracker(index);
  return feedInto(tracker, text);
}

/** Feed text incrementally (simulates finals arriving in chunks). */
function feedInto(tracker: RecitationTracker, text: string): TrackerResult {
  const words = text.trim().split(/\s+/);
  let acc = "";
  let last: TrackerResult = tracker.feed("", "");
  for (const w of words) {
    acc = acc ? `${acc} ${w}` : w;
    last = tracker.feed(acc, "");
  }
  return last;
}

// ---------------------------------------------------------------------------
section("normalization");
{
  const cases: Array<[string, string, string]> = [
    ["ٱلْحَمْدُ", "الحمد", "hamzat wasl + harakat"],
    ["ٱلْعَـٰلَمِينَ", "العالمين", "dagger alef -> full alef"],
    ["ٱلصِّرَٰطَ", "الصراط", "dagger alef in sirat"],
    ["ٱلرَّحْمَـٰنِ", "الرحمان", "rahman keeps long vowel"],
    ["مَـٰلِكِ", "مالك", "malik"],
    ["ءَامَنُوا۟", "امنوا", "initial hamza+alef, silent-mark waw kept"],
    ["أُو۟لَـٰٓئِكَ", "اولايك", "ulaika skeleton"],
    ["ٱلصَّلَوٰةَ", "الصلواه", "salah with dagger + ta marbuta"],
    ["إِبْرَٰهِـۧمَ", "ابراهيم", "small high yeh restored"],
    ["دَاوُۥدَ", "داوود", "small waw restored"],
    ["يُؤْمِنُونَ", "يومنون", "waw hamza mapped"],
    ["شَىْءٍ", "شي", "alef maqsura + hamza dropped"],
    ["﴿١٢٣﴾", "", "digits/symbols stripped"],
  ];
  for (const [input, expected, label] of cases) {
    const got = normalizeArabicWord(input);
    check(`normalize ${label}`, got === expected, `got "${got}" want "${expected}"`);
  }
  check(
    "tokenize drops empties",
    tokenizeArabic("بِسْمِ ٱللَّهِ ١ ، الم").join("|") === "بسم|الله|الم"
  );
  check("levenshtein basic", levenshtein("الرحمن", "الرحمان") === 1);
  check("short words exact only", !isWordMatch("من", "ما"));
  check("fuzzy match rahman", isWordMatch("الرحمن", "الرحمان"));
}

// ---------------------------------------------------------------------------
section("index integrity (hafs)");
const hafsPages = loadPages("data_hafs.json");
const t0 = Date.now();
const hafs = buildRecitationIndex(hafsPages);
const buildMs = Date.now() - t0;
{
  console.log(
    `  built in ${buildMs}ms — ${hafs.words.length} words, ${hafs.ayahs.length} ayahs`
  );
  check("6236 ayahs", hafs.ayahs.length === 6236, `got ${hafs.ayahs.length}`);
  check(
    "word count plausible",
    hafs.words.length > 76000 && hafs.words.length < 79000,
    `got ${hafs.words.length}`
  );
  check("build under 2s", buildMs < 2000, `${buildMs}ms`);

  const surahs = new Set(hafs.words.map((w) => w.surah));
  check("114 surahs", surahs.size === 114, `got ${surahs.size}`);

  const fatiha1 = hafs.ayahByKey.get(ayahKey(1, 1))!;
  const fatihaText = hafs.words
    .slice(fatiha1.startSeq, fatiha1.endSeq + 1)
    .map((w) => w.norm)
    .join(" ");
  check(
    "1:1 text",
    fatihaText === "بسم الله الرحمان الرحيم",
    `got "${fatihaText}"`
  );
  check("1:1 on page 1", fatiha1.page === 1);
  check("1:1 ids 1..5", fatiha1.startId === 1 && fatiha1.endId === 5,
    `got ${fatiha1.startId}..${fatiha1.endId}`);

  const kursi = hafs.ayahByKey.get(ayahKey(2, 255))!;
  check("2:255 exists on page 42", kursi.page === 42, `got page ${kursi.page}`);

  const lastAyah = hafs.ayahByKey.get(ayahKey(114, 6))!;
  check("114:6 present, page 604", lastAyah.page === 604, `got ${lastAyah?.page}`);

  // Waqf-mark spans (ۖ ۚ ...) must not consume word ids: on page 2 line 3
  // the mushaf numbers الم=37 ١=38 ذلك=39 الكتاب=40 لا=41 ريب=42 [ۛ] فيه=43
  const baqara2 = hafs.ayahByKey.get(ayahKey(2, 2))!;
  const fihi = hafs.words
    .slice(baqara2.startSeq, baqara2.endSeq + 1)
    .find((w) => w.norm === "فيه");
  check("waqf spans skip ids (2:2 فيه id=43)", fihi?.id === 43, `got ${fihi?.id}`);
  check("2:2 starts at id 39", baqara2.startId === 39, `got ${baqara2.startId}`);

  // every ayah's marker id should be >= its last word id
  let ranges = true;
  for (const a of hafs.ayahs) {
    if (a.endId < a.startId) ranges = false;
  }
  check("ayah id ranges valid", ranges);
}

// ---------------------------------------------------------------------------
section("cold lock + follow (Fatiha)");
{
  const tracker = new RecitationTracker(hafs);
  let r = feedInto(tracker, "الحمد لله رب العالمين");
  check("locks 1:2", fmt(r).startsWith("1:2"), fmt(r));
  r = feedInto(tracker, "الرحمن الرحيم");
  check("follows to 1:3", fmt(r).startsWith("1:3"), fmt(r));
  r = feedInto(tracker, "مالك يوم الدين");
  check("follows to 1:4", fmt(r).startsWith("1:4"), fmt(r));
  r = feedInto(tracker, "اياك نعبد واياك نستعين");
  check("follows to 1:5", fmt(r).startsWith("1:5"), fmt(r));
  r = feedInto(
    tracker,
    "اهدنا الصراط المستقيم صراط الذين انعمت عليهم غير المغضوب عليهم ولا الضالين"
  );
  check("follows to 1:7", fmt(r).startsWith("1:7"), fmt(r));
}

// ---------------------------------------------------------------------------
section("isti'adha + basmallah then Baqara (muqatta'at junk)");
{
  const tracker = new RecitationTracker(hafs);
  // ASR typically renders الم as spelled-out letters or noise
  const r = feedInto(
    tracker,
    "اعوذ بالله من الشيطان الرجيم بسم الله الرحمن الرحيم الف لام ميم ذلك الكتاب لا ريب فيه هدى للمتقين"
  );
  check("locks in 2:2", fmt(r).startsWith("2:2 "), fmt(r));
}

// ---------------------------------------------------------------------------
section("global jump to Ayat al-Kursi");
{
  const tracker = new RecitationTracker(hafs);
  feedInto(tracker, "قل هو الله احد الله الصمد");
  const before = feedInto(tracker, "");
  check("locked in 112", before.word?.surah === 112, fmt(before));
  // reciter jumps: misses accumulate, re-search, re-lock
  const r = feedInto(
    tracker,
    "الله لا اله الا هو الحي القيوم لا تاخذه سنه ولا نوم"
  );
  check("re-locks at 2:255", fmt(r).startsWith("2:255"), fmt(r));
  check("page 42", r.word?.page === 42, `page ${r.word?.page}`);
}

// ---------------------------------------------------------------------------
section("repeated phrase (Ar-Rahman refrain)");
{
  const tracker = new RecitationTracker(hafs);
  // The refrain alone appears 31 times — must NOT lock on it blindly
  let r = feedInto(tracker, "فباي الاء ربكما تكذبان");
  check("refrain alone stays ambiguous", r.phase === "searching", fmt(r));
  // Continuing with a unique following ayah disambiguates:
  // 55:13 refrain then 55:14 "خلق الانسان من صلصال كالفخار"
  r = feedInto(tracker, "خلق الانسان من صلصال كالفخار");
  check("disambiguates to 55:14", fmt(r).startsWith("55:14"), fmt(r));
}

// ---------------------------------------------------------------------------
section("same-surah identical refrain follows in reading order");
{
  // Ar-Rahman's refrain is identical 31 times within ONE surah. Once locked,
  // follow mode must advance to the NEXT occurrence, never jump to another.
  const tracker = new RecitationTracker(hafs);
  let r = feedInto(
    tracker,
    "فباي الاء ربكما تكذبان خلق الانسان من صلصال كالفخار وخلق الجان من مارج من نار"
  );
  check("locks 55:15 via refrain + context", fmt(r).startsWith("55:15"), fmt(r));
  r = feedInto(tracker, "فباي الاء ربكما تكذبان");
  check("refrain again advances to 55:16 (next in order)", fmt(r).startsWith("55:16"), fmt(r));
  r = feedInto(tracker, "يا معشر الجن والانس ان استطعتم ان تنفذوا من اقطار السماوات والارض فانفذوا");
  check("continues into 55:33", fmt(r).startsWith("55:33"), fmt(r));
}

// ---------------------------------------------------------------------------
section("identical ayahs stay ambiguous (2:5 == 31:5)");
{
  const tracker = new RecitationTracker(hafs);
  const r = feedInto(tracker, "اولئك على هدى من ربهم واولئك هم المفلحون");
  check("identical-ayah recitation does not lock", r.phase === "searching", fmt(r));
}

// ---------------------------------------------------------------------------
section("cross-page follow (page 2 -> 3 boundary)");
{
  const tracker = new RecitationTracker(hafs);
  // 2:4 (unique context) then 2:5 then 2:6 which starts page 3
  let r = feedInto(
    tracker,
    "والذين يؤمنون بما انزل اليك وما انزل من قبلك وبالاخرة هم يوقنون"
  );
  check("locks 2:4", fmt(r).startsWith("2:4 "), fmt(r));
  r = feedInto(tracker, "اولئك على هدى من ربهم واولئك هم المفلحون");
  check("follows to 2:5", fmt(r).startsWith("2:5 "), fmt(r));
  r = feedInto(
    tracker,
    "ان الذين كفروا سواء عليهم ءانذرتهم ام لم تنذرهم لا يؤمنون"
  );
  check("follows to 2:6 on page 3", fmt(r).startsWith("2:6 "), fmt(r));
  check("page advanced to 3", r.word?.page === 3, `page ${r.word?.page}`);
}

// ---------------------------------------------------------------------------
section("ASR noise tolerance");
{
  const tracker = new RecitationTracker(hafs);
  // Kahf 18:1-2 with typical ASR mangling (missing/approximate words)
  const r = feedInto(
    tracker,
    "الحمد لله الذي انزل على عبده الكتب ولم يجعل له عوجا قيما لينذر باسا شديدا"
  );
  check("locks and follows within 18:1-2", r.word?.surah === 18 && (r.word.ayah === 1 || r.word.ayah === 2), fmt(r));
}

// ---------------------------------------------------------------------------
section("interim churn consistency");
{
  // Simulates real recognizer behaviour: volatile interim text that mutates
  // then finalizes. Final position must equal the one-shot result.
  const t1 = new RecitationTracker(hafs);
  t1.feed("", "قل هو");
  t1.feed("", "قل هو الله");
  t1.feed("", "قل هو الله اح");
  const rInterim = t1.feed("قل هو الله احد", "");
  const r2 = t1.feed("قل هو الله احد الله الصمد", "");

  const oneShot = recite(hafs, "قل هو الله احد الله الصمد");
  check(
    "interim churn matches one-shot",
    fmt(r2) === fmt(oneShot),
    `${fmt(r2)} vs ${fmt(oneShot)}`
  );
  console.log(`  (after finals: ${fmt(rInterim)}, one-shot: ${fmt(oneShot)})`);
}

// ---------------------------------------------------------------------------
section("backtrack: reciter restarts the ayah");
{
  const tracker = new RecitationTracker(hafs);
  let r = feedInto(tracker, "الله لا اله الا هو الحي القيوم لا تاخذه سنة ولا نوم");
  check("locked 2:255 mid-ayah", fmt(r).startsWith("2:255"), fmt(r));
  // reciter goes back and restarts the ayah from its beginning
  r = feedInto(
    tracker,
    "الله لا اله الا هو الحي القيوم لا تاخذه سنة ولا نوم له ما في السماوات وما في الارض"
  );
  check(
    "re-locks in 2:255 after restart (proximity)",
    fmt(r).startsWith("2:255"),
    fmt(r)
  );
}

// ---------------------------------------------------------------------------
section("short surah full recitation (Al-Ikhlas 112)");
{
  const tracker = new RecitationTracker(hafs);
  const r = feedInto(
    tracker,
    "بسم الله الرحمن الرحيم قل هو الله احد الله الصمد لم يلد ولم يولد ولم يكن له كفوا احد"
  );
  check("ends at 112:4", fmt(r).startsWith("112:4"), fmt(r));
}

// ---------------------------------------------------------------------------
section("surah boundary with basmallah skip (114 after 113)");
{
  const tracker = new RecitationTracker(hafs);
  let r = feedInto(
    tracker,
    "قل اعوذ برب الفلق من شر ما خلق ومن شر غاسق اذا وقب ومن شر النفاثات في العقد ومن شر حاسد اذا حسد"
  );
  check("finishes 113:5", fmt(r).startsWith("113:5"), fmt(r));
  r = feedInto(
    tracker,
    "بسم الله الرحمن الرحيم قل اعوذ برب الناس ملك الناس"
  );
  check("crosses into 114:2", fmt(r).startsWith("114:2"), fmt(r));
}

// ---------------------------------------------------------------------------
section("hisham index smoke test");
{
  const hishamPages = loadPages("data_hisham.json");
  const hisham = buildRecitationIndex(hishamPages);
  console.log(`  ${hisham.words.length} words, ${hisham.ayahs.length} ayahs`);
  check("6226 ayahs (Shami count)", hisham.ayahs.length === 6226, `got ${hisham.ayahs.length}`);
  const r = recite(hisham, "الحمد لله رب العالمين الرحمن الرحيم");
  check("locks Fatiha in hisham", r.word?.surah === 1, fmt(r));
  // the glued marker-word quirk pages
  const baqara243 = hisham.ayahByKey.get(ayahKey(2, 243));
  const baqara244 = hisham.ayahByKey.get(ayahKey(2, 244));
  check("2:243/2:244 exist despite glued marker", !!baqara243 && !!baqara244);
}

// ---------------------------------------------------------------------------
section("search performance");
{
  const tracker = new RecitationTracker(hafs);
  const t = Date.now();
  feedInto(tracker, "ان الله مع الصابرين"); // common words — worst-ish case
  const ms = Date.now() - t;
  console.log(`  common-word search took ${ms}ms`);
  check("search under 500ms", ms < 500, `${ms}ms`);
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(f);
  process.exit(1);
}

"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import "./styles.css";
import { FaSpinner, FaSun, FaMoon, FaCog } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { BookOpen, Search, Check, Mic, MicOff, X } from "lucide-react";
import { allSurahs, SurahInfo } from "@/app/lib/surah-definitions";
import { cn } from "@/lib/utils";
import { normalizeArabicWord } from "./recitation/arabic";
import { buildRecitationIndex, type RecitationIndex } from "./recitation/indexer";
import {
  useRecitationFollower,
  type FollowerSnapshot,
} from "./recitation/useRecitationFollower";

interface PageContent {
  html_content: string;
  notes_content?: string;
}

interface QuranData {
  [pageNumber: string]: PageContent;
}

type ParsedWord =
  | { kind: "word"; text: string; isRed: boolean; ayahClass: string }
  | { kind: "marker"; text: string };

type ParsedLine =
  | { kind: "surah_header"; surahNumber: number }
  | { kind: "basmallah" }
  | {
      kind: "quran_line";
      lineNumber: string | null;
      pageNumber: string | null;
      firstWordId: string | null;
      lastWordId: string | null;
      lineId: string | null;
      isCentered: boolean;
      words: ParsedWord[];
    };

interface ParsedNote {
  redText: string;
  trailingText: string;
}

function parseQuranHtml(html: string): ParsedLine[] {
  if (typeof window === "undefined" || !html) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [];

  const lines: ParsedLine[] = [];
  for (const child of Array.from(root.children)) {
    if (child.classList.contains("surah-name")) {
      const span = child.querySelector(".surah-name-v4");
      const match = span?.textContent?.match(/surah(\d+)/);
      const surahNumber = match ? parseInt(match[1], 10) : 0;
      lines.push({ kind: "surah_header", surahNumber });
    } else if (child.classList.contains("bismillah")) {
      lines.push({ kind: "basmallah" });
    } else if (child.tagName.toLowerCase() === "p" && child.classList.contains("quran-line")) {
      const isCentered = child.classList.contains("justify-center");
      const words: ParsedWord[] = [];
      for (const el of Array.from(child.children)) {
        if (el.classList.contains("word")) {
          const textEl = el.querySelector(".text");
          const ayahClass = Array.from(el.classList).find((c) => c.startsWith("ayah-")) || "";
          const innerStyle = textEl?.getAttribute("style") || "";
          const outerStyle = el.getAttribute("style") || "";
          const isRed = /color\s*:\s*red/i.test(innerStyle) || /color\s*:\s*red/i.test(outerStyle);
          words.push({
            kind: "word",
            text: textEl?.textContent || "",
            isRed,
            ayahClass,
          });
        } else if (el.classList.contains("arabic-num-marker")) {
          words.push({ kind: "marker", text: el.textContent || "" });
        }
      }
      lines.push({
        kind: "quran_line",
        lineNumber: child.getAttribute("data-line"),
        pageNumber: child.getAttribute("data-pag") || child.getAttribute("data-page"),
        firstWordId: child.getAttribute("data-first-word-id"),
        lastWordId: child.getAttribute("data-last-word-id"),
        lineId: child.getAttribute("id"),
        isCentered,
        words,
      });
    }
  }
  return lines;
}

function parseQuranNotes(html: string): ParsedNote[] {
  if (typeof window === "undefined" || !html) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<ul id="root">${html}</ul>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [];

  const notes: ParsedNote[] = [];
  for (const li of Array.from(root.children)) {
    const redSpan = li.querySelector("span");
    const redText = redSpan?.textContent || "";
    const fullText = li.textContent || "";
    const trailingText = fullText.slice(redText.length);
    notes.push({ redText, trailingText });
  }
  return notes;
}

function SurahHeader({ surahNumber }: { surahNumber: number }) {
  return (
    <div className="surah-name">
      <div className="quran-icon surah-header text-center flex justify-center">header</div>
      <div className="surah-icon text-center flex justify-center">
        <span className="surah-name-v4 me-2">surah{surahNumber.toString().padStart(3, "0")}</span>
        <span className="surah-name-v4">surah-icon</span>
      </div>
    </div>
  );
}

function Basmallah() {
  return <div className="bismillah text-center flex justify-center"> ﷽</div>;
}

interface QuranLineProps {
  line: Extract<ParsedLine, { kind: "quran_line" }>;
  /** Recited-ayah highlight range clipped to this line (span ids), or null. */
  hlStart: number | null;
  hlEnd: number | null;
  hlWord: number | null;
}

/**
 * One mushaf line. Span ids are assigned the way the source data numbers
 * them: sequentially from data-first-word-id across words and ayah markers,
 * skipping spans that hold only waqf marks — mirroring the recitation
 * indexer so highlight id ranges line up exactly.
 */
const QuranLine = memo(function QuranLine({ line, hlStart, hlEnd, hlWord }: QuranLineProps) {
  const alignmentClass = line.isCentered
    ? "text-center flex justify-center"
    : "flex justify-between";
  let nextId = line.firstWordId ? parseInt(line.firstWordId, 10) : null;
  return (
    <p
      className={`quran-line ${alignmentClass}`}
      data-pag={line.pageNumber ?? undefined}
      data-line={line.lineNumber ?? undefined}
      data-first-word-id={line.firstWordId ?? undefined}
      data-last-word-id={line.lastWordId ?? undefined}
      id={line.lineId ?? undefined}
    >
      {line.words.map((wordData, wordIndex) => {
        let spanId: number | null = null;
        if (nextId !== null) {
          if (wordData.kind === "marker" || normalizeArabicWord(wordData.text)) {
            spanId = nextId;
            nextId++;
          }
        }
        const inAyah =
          spanId !== null && hlStart !== null && hlEnd !== null &&
          spanId >= hlStart && spanId <= hlEnd;
        const isCurrent = spanId !== null && hlWord !== null && spanId === hlWord;
        if (wordData.kind === "marker") {
          return (
            <span
              key={wordIndex}
              className={cn("arabic-num-marker", inAyah && "recited-ayah")}
              data-wid={spanId ?? undefined}
            >
              {wordData.text}
            </span>
          );
        }
        return (
          <span
            key={wordIndex}
            className={cn(
              "word",
              wordData.ayahClass,
              inAyah && "recited-ayah",
              isCurrent && "recited-word"
            )}
            data-wid={spanId ?? undefined}
          >
            <span
              className="text"
              style={wordData.isRed ? { color: "red" } : undefined}
            >
              {wordData.text}
            </span>
          </span>
        );
      })}
    </p>
  );
});

function ListeningPill({
  snapshot,
  onStop,
  onDismissError,
}: {
  snapshot: FollowerSnapshot;
  onStop: () => void;
  onDismissError: () => void;
}) {
  if (snapshot.status === "idle") return null;

  if (snapshot.status === "error") {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[92vw]">
        <div className="flex items-center gap-3 rounded-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 shadow-lg px-4 py-2 text-sm">
          <span>{snapshot.error}</span>
          <button
            onClick={onDismissError}
            className="shrink-0 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const locked = snapshot.phase === "locked" && snapshot.surah !== null;
  const surahName = locked
    ? allSurahs[(snapshot.surah as number) - 1]?.name ?? `Surah ${snapshot.surah}`
    : null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[92vw]">
      <div className="flex items-center gap-3 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur border shadow-lg px-4 py-2">
        <span className="relative flex h-3 w-3 shrink-0">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
              locked ? "bg-green-500" : "bg-red-400"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-3 w-3",
              locked ? "bg-green-500" : "bg-red-500"
            )}
          />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {snapshot.status === "preparing"
              ? "Preparing…"
              : locked
                ? `${surahName} · Ayah ${snapshot.ayah}`
                : !snapshot.micActive
                  ? "Waiting for microphone…"
                  : "Listening — recite to locate…"}
          </span>
          {snapshot.tail && (
            <span
              dir="rtl"
              className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[16rem]"
            >
              {snapshot.tail}
            </span>
          )}
        </div>
        <button
          onClick={onStop}
          className="shrink-0 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Stop listening"
          title="Stop listening"
        >
          <MicOff className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function QuranReader() {
  const [quranData, setQuranData] = useState<QuranData>({});
  const [loading, setLoading] = useState(true);
  const [qiraat, setQiraat] = useState("hafs");
  const [font, setFont] = useState("-me-quran");
  const [pageNumber, setPageNumber] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<SurahInfo>(allSurahs[0]);
  const [surahSelectorOpen, setSurahSelectorOpen] = useState(false);

  const colorThemes = {
    cream: { light: '#fdfdfa', dark: '#1a1a1a' },
    parchment: { light: '#f8f0da', dark: '#2a2118' },
    white: { light: '#ffffff', dark: '#1e1e2c' },
    grey: { light: '#f0f4f8', dark: '#192231' },
  };

  type ColorThemeName = keyof typeof colorThemes;

  const [colorTheme, setColorTheme] = useState<ColorThemeName>("cream");
  const [border, setBorder] = useState("green");
  const totalPages = 604; // Standard total pages in a Mushaf

  const backgroundColor = colorThemes[colorTheme][isDarkMode ? 'dark' : 'light'];

  useEffect(() => {
    async function fetchQuranData() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/quran?qiraat=${qiraat}&font=${font == "-me-quran" ? "" : font}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch Quran data");
        }
        const data = await response.json();
        setQuranData(data.pages || {});
      } catch (error) {
        console.error("Fetch error:", error);
        setQuranData({});
      } finally {
        setLoading(false);
      }
    }
    fetchQuranData();
  }, [qiraat, font]);

  const pageContent = quranData[pageNumber] ? quranData[pageNumber] : null;

  const parsedLines = useMemo(
    () => (pageContent ? parseQuranHtml(pageContent.html_content) : []),
    [pageContent]
  );
  const parsedNotes = useMemo(
    () => (pageContent?.notes_content ? parseQuranNotes(pageContent.notes_content) : []),
    [pageContent]
  );

  // --- Recitation follow-along (listen & jump to the recited ayah) ---
  const [listenRequested, setListenRequested] = useState(false);
  const [recitationIndex, setRecitationIndex] = useState<RecitationIndex | null>(null);

  // Build the index lazily on first use and rebuild when the mushaf data
  // (qiraat/font) changes, so matching always follows the displayed text.
  useEffect(() => {
    setRecitationIndex(null);
    if (!listenRequested || loading || Object.keys(quranData).length === 0) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setRecitationIndex(buildRecitationIndex(quranData));
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [listenRequested, quranData, loading]);

  const { snapshot, listening, start: startListening, stop: stopListening } =
    useRecitationFollower(recitationIndex);

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      setListenRequested(true);
      startListening();
    }
  }, [listening, startListening, stopListening]);

  // Jump to the detected ayah's page whenever the detected position moves.
  useEffect(() => {
    if (snapshot.phase !== "locked" || snapshot.page === null) return;
    setPageNumber((prev) => (prev === snapshot.page ? prev : (snapshot.page as number)));
  }, [snapshot.phase, snapshot.page, snapshot.surah, snapshot.ayah]);

  // Keep the recited word in view as it advances. Scrolls are instant:
  // smooth animations get canceled/paused by per-word re-renders and
  // background tabs, so they can silently never arrive. The delayed
  // re-check corrects for layout shifts (font loading) right after a page
  // change; both calls no-op while the word is already in the band.
  useEffect(() => {
    if (snapshot.phase !== "locked" || snapshot.wordId === null || loading) return;
    const ensureVisible = () => {
      const el = document.querySelector(`[data-wid="${snapshot.wordId}"]`);
      if (!el) return;
      const viewportH = Math.max(
        window.innerHeight || 0,
        document.documentElement.clientHeight || 0
      );
      if (viewportH === 0) return;
      const rect = el.getBoundingClientRect();
      if (rect.top >= 100 && rect.bottom <= viewportH - 140) return;
      el.scrollIntoView({ behavior: "auto", block: "center" });
    };
    const raf = requestAnimationFrame(ensureVisible);
    const recheck = setTimeout(ensureVisible, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(recheck);
    };
  }, [snapshot.wordId, snapshot.phase, loading, pageNumber]);

  const handleNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages));
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger on input fields
      if (e.target instanceof HTMLInputElement) {
        return;
      }
      if (e.key === "ArrowRight") {
        handlePreviousPage();
      } else if (e.key === "ArrowLeft") {
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextPage, handlePreviousPage]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setPageNumber(value);
    } else if (e.target.value === "") {
      // Allow clearing the input
    }
  };

  const handlePageInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setPageNumber(1); // Reset to 1 if input is empty
    }
  };

  const handleQiraatChange = (value: string) => {
    setQiraat(value);
  };

  const handleFontChange = (value: string) => {
    setFont(value);
  };

  const handleSurahChange = (surah: SurahInfo) => {
    setSelectedSurah(surah);
    setSurahSelectorOpen(false);
    // Navigate to the Surah's starting page
    setPageNumber(surah.startPage);
  };

  const dynamicStyles = `
    #mushaf-display .quran-line {
      font-family: ${font === "-digital-khatt" ? "digitalkhatt" : "me_quran"} !important;
    }
  `;

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row h-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Card className="w-full md:w-64 md:min-h-[800px] flex flex-col shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">Quran Reader</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0 md:pt-6">
          {/* Surah Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Surah</label>
            <Popover open={surahSelectorOpen} onOpenChange={setSurahSelectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={surahSelectorOpen}
                  className="w-full justify-between text-left font-normal"
                >
                  <span className="truncate">{selectedSurah.fullName}</span>
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search Surah..." className="h-9 outline-none" />
                  <CommandList>
                    <CommandEmpty>No Surah found.</CommandEmpty>
                    <CommandGroup>
                      {allSurahs.map((surah) => (
                        <CommandItem
                          key={surah.number}
                          value={surah.fullName}
                          onSelect={() => handleSurahChange(surah)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono">{surah.number}</span>
                            <span className="font-medium">{surah.name}</span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedSurah.number === surah.number ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label htmlFor="qiraat-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qira&apos;at</label>
            <Select value={qiraat} onValueChange={handleQiraatChange}>
              <SelectTrigger id="qiraat-select" className="w-full">
                <SelectValue placeholder="Select Qira'at" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hafs">Hafs</SelectItem>
                <SelectItem value="hisham">Hisham</SelectItem>
                <SelectItem value="ibn-dhakwan">Ibn Dhakwan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="font-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font</label>
            <Select value={font} onValueChange={handleFontChange}>
              <SelectTrigger id="font-select" className="w-full">
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-me-quran">Me Quran</SelectItem>
                {qiraat === "hafs" && (
                  <SelectItem value="-digital-khatt">Digital Khatt</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Header with Navigation */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b z-10 shadow-md">
          <div className="max-w-4xl mx-auto p-3 flex flex-wrap justify-center items-center gap-4">
            <Button onClick={handleNextPage} disabled={pageNumber === totalPages} variant="outline">
              &larr; Next
            </Button>
            <div className="flex items-center">
              <Input
                type="number"
                id="pageNumber"
                name="pageNumber"
                value={pageNumber}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                className="w-20 text-center"
                min="1"
                max={totalPages}
              />
              <span className="mx-3 text-gray-600 dark:text-gray-400 font-medium">
                / {totalPages}
              </span>
            </div>
            <Button onClick={handlePreviousPage} disabled={pageNumber === 1} variant="outline">
              Previous &rarr;
            </Button>
            <Button
              onClick={toggleListening}
              className={cn(
                "ml-4 gap-2 font-semibold text-white shadow-md",
                listening
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-700"
              )}
              title={
                listening
                  ? "Stop follow-along"
                  : "Recite and the reader finds the ayah and follows along"
              }
              aria-label={listening ? "Stop follow-along" : "Start follow-along"}
            >
              {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span>{listening ? "Listening…" : "Follow along"}</span>
            </Button>
            <Button onClick={toggleDarkMode} variant="ghost" size="icon">
              {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <FaCog className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize the appearance.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="background-color" className="text-sm font-medium">Background Color</label>
                    <div className="flex space-x-2 mt-2">
                      <Button onClick={() => setColorTheme('cream')} className="h-8 w-8 rounded-full" style={{ backgroundColor: colorThemes.cream[isDarkMode ? 'dark' : 'light'], border: '1px solid #ccc' }} />
                      <Button onClick={() => setColorTheme('parchment')} className="h-8 w-8 rounded-full" style={{ backgroundColor: colorThemes.parchment[isDarkMode ? 'dark' : 'light'], border: '1px solid #ccc' }} />
                      <Button onClick={() => setColorTheme('white')} className="h-8 w-8 rounded-full" style={{ backgroundColor: colorThemes.white[isDarkMode ? 'dark' : 'light'], border: '1px solid #ccc' }} />
                      <Button onClick={() => setColorTheme('grey')} className="h-8 w-8 rounded-full" style={{ backgroundColor: colorThemes.grey[isDarkMode ? 'dark' : 'light'], border: '1px solid #ccc' }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="border-select" className="text-sm font-medium">Border Style</label>
                    <Select value={border} onValueChange={setBorder}>
                      <SelectTrigger id="border-select" className="w-full mt-2">
                        <SelectValue placeholder="Select Border" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow sm:p-6">
          <style>{dynamicStyles}</style>
          <Card className="max-w-5xl mx-auto quranPageContainer md:shadow-lg shadow-none" style={{ backgroundColor }}>
            <CardContent className="text-center text-xl leading-loose border-0 p-0 md:p-2">
              {loading && (
                  <div className="flex justify-center items-center py-4">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </div>
              )}
              {!loading && pageContent ? (
                <div className="flex flex-col md:flex-row items-center justify-center">
                  <div id="mushaf-display" className={`quran-page border-${border}`}>
                    <div className="quran-page-content">
                      {parsedLines.map((line, index) => {
                        if (line.kind === "surah_header") {
                          return <SurahHeader key={index} surahNumber={line.surahNumber} />;
                        }
                        if (line.kind === "basmallah") {
                          return <Basmallah key={index} />;
                        }
                        // Clip the recited-ayah highlight to this line so
                        // unaffected lines keep stable props (memo skips them).
                        let hlStart: number | null = null;
                        let hlEnd: number | null = null;
                        let hlWord: number | null = null;
                        if (
                          snapshot.phase === "locked" &&
                          snapshot.ayahStartId !== null &&
                          snapshot.ayahEndId !== null &&
                          line.firstWordId &&
                          line.lastWordId
                        ) {
                          const lineFirst = parseInt(line.firstWordId, 10);
                          const lineLast = parseInt(line.lastWordId, 10);
                          if (
                            snapshot.ayahStartId <= lineLast &&
                            snapshot.ayahEndId >= lineFirst
                          ) {
                            hlStart = snapshot.ayahStartId;
                            hlEnd = snapshot.ayahEndId;
                            hlWord = snapshot.wordId;
                          }
                        }
                        return (
                          <QuranLine
                            key={index}
                            line={line}
                            hlStart={hlStart}
                            hlEnd={hlEnd}
                            hlWord={hlWord}
                          />
                        );
                      })}
                    </div>
                  </div>
                  {parsedNotes.length > 0 && (
                    <ul className="p-4 md:p-8">
                      {parsedNotes.map((note, index) => (
                        <li key={index} className="notes">
                          <span style={{ color: "red" }}>{note.redText}</span>
                          {note.trailingText}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                !loading && (
                  <div className="my-4 min-h-[70vh] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    <p className="text-gray-400 text-xl text-center">
                      Could not load page content. Please check the selected
                      Qira&apos;at and Font.
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <ListeningPill
        snapshot={snapshot}
        onStop={toggleListening}
        onDismissError={stopListening}
      />
    </div>
    </div>
  );
}

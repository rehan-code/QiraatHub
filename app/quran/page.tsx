"use client";

import { useEffect, useState, useCallback } from "react";
import "./styles.css";
import { FaSpinner, FaSun, FaMoon, FaCog } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookOpen } from "lucide-react";

interface PageContent {
  html_content: string;
  notes_content: string;
}

interface QuranData {
  [pageNumber: string]: PageContent;
}

export default function QuranReader() {
  const [quranData, setQuranData] = useState<QuranData>({});
  const [loading, setLoading] = useState(true);
  const [qiraat, setQiraat] = useState("hafs");
  const [font, setFont] = useState("-me-quran");
  const [pageNumber, setPageNumber] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
            <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="ml-4">
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
                <>
                {pageContent.html_content && (
                  <div className="flex flex-col md:flex-row items-center justify-center">
                    <div id="mushaf-display" className={`quran-page border-${border}`}>
                      <div
                        dangerouslySetInnerHTML={{ __html: pageContent.html_content }}
                      />
                    </div>
                    {pageContent.notes_content && (
                        <ul
                          className="p-4 md:p-8"
                          dangerouslySetInnerHTML={{ __html: pageContent.notes_content }}
                        />
                    )}
                  </div>
                )}
                </>
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
    </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import "./styles.css";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const totalPages = 604; // Standard total pages in a Mushaf

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

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

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
    .notes span {
      font-family: ${font === "-digital-khatt" ? "digitalkhatt" : "me_quran"} !important;
    }
  `;

  return (
    <div className="flex h-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Card className="w-64 flex flex-col shadow-lg border-0">
        <CardHeader>
          <CardTitle>Quran Reader</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <SelectItem value="-digital-khatt">Digital Khatt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Header with Navigation */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b z-10 shadow-md">
          <div className="max-w-4xl mx-auto p-3 flex justify-center items-center space-x-4">
            <Button onClick={handlePreviousPage} disabled={pageNumber === 1} variant="outline">
              &larr; Previous
            </Button>
            <div className="flex items-center">
              <Input
                type="number"
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
            <Button onClick={handleNextPage} disabled={pageNumber === totalPages} variant="outline">
              Next &rarr;
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6">
          <style>{dynamicStyles}</style>
          <Card className="max-w-5xl mx-auto quranPageContainer shadow-lg">
            <CardContent className="text-center text-xl leading-loose p-2">
              {loading && (
                  <div className="flex justify-center items-center py-4">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </div>
              )}
              {!loading && pageContent ? (
                <>
                {pageContent.html_content && (
                  <div className="flex flex-row items-center justify-center">
                    <div id="mushaf-display" className="p-8">
                      <div
                        dangerouslySetInnerHTML={{ __html: pageContent.html_content }}
                      />
                    </div>
                    {pageContent.notes_content && (
                        <ul
                          className=" p-8"
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
  );
}

"use client";

import { useEffect, useState } from "react";
import "./styles.css";
import { FaSpinner } from "react-icons/fa";

export default function QuranReader() {
  const [quranData, setQuranData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qiraat, setQiraat] = useState("hafs");
  const [font, setFont] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 604; // Standard total pages in a Mushaf

  useEffect(() => {
    async function fetchQuranData() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/quran?qiraat=${qiraat}&font=${font}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch Quran data");
        }
        const data = await response.json();
        console.log(data);
        setQuranData(data.pages || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setQuranData([]);
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

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  const handleQiraatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQiraat(e.target.value);
  };

  const dynamicStyles = `
    #mushaf-display .quran-line {
      font-family: ${font === "-digital-khatt" ? "digitalkhatt" : "me_quran"} !important;
    }
  `;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Quran Reader
        </h1>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="qiraat-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Qira'at
            </label>
            <select
              id="qiraat-select"
              value={qiraat}
              onChange={handleQiraatChange}
              className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-sm"
            >
              <option value="hafs">Hafs</option>
              <option value="hisham">Hisham</option>
              <option value="ibn-dhakwan">Ibn Dhakwan</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="font-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Font
            </label>
            <select
              id="font-select"
              value={font}
              onChange={handleFontChange}
              className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-sm"
            >
              <option value="">Hafs</option>
              <option value="-digital-khatt">Digital Khatt</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Header with Navigation */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md z-10">
          <div className="max-w-4xl mx-auto p-3 flex justify-center items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              &larr; Previous
            </button>
            <div className="flex items-center">
              <input
                type="number"
                value={pageNumber}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                className="w-20 text-center p-2 rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max={totalPages}
              />
              <span className="mx-3 text-gray-600 dark:text-gray-400 font-medium">
                / {totalPages}
              </span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={pageNumber === totalPages}
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              Next &rarr;
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-grow p-6 overflow-y-auto">
          <style>{dynamicStyles}</style>
          <div className="max-w-4xl mx-auto shadow-lg rounded-lg quranPageContainer">
            <div
              className="text-center text-2xl leading-loose"
              id="mushaf-display-container"
            >
              {loading && (
                  <div className="flex justify-center items-center py-4">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </div>
              )}
              {!loading && pageContent ? (
                <div id="mushaf-display" className="p-8">
                  <div
                    dangerouslySetInnerHTML={{ __html: pageContent.html_content }}
                  />
                </div>
              ) : (
                !loading && (
                  <div className="my-4 min-h-[70vh] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    <p className="text-gray-400 text-xl text-center">
                      Could not load page content. Please check the selected
                      Qira'at and Font.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

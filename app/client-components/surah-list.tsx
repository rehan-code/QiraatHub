"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useSurah } from "@/contexts/surah-context";
import SearchBar from "./search-bar";
import { Menu, BookOpen, ChevronRight, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { allSurahs, SurahInfo } from "../lib/surah-definitions";

interface SurahDisplayContentProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  filteredSurahs: SurahInfo[];
  selectedSurah: string;
  onSurahSelect: (surahFullName: string) => void;
}

const SurahDisplayContent = memo(({ 
  searchQuery, 
  onSearch, 
  filteredSurahs, 
  selectedSurah, 
  onSurahSelect 
}: SurahDisplayContentProps) => {
  return (
    <>
      <CardHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-yellow-500" />
          <CardTitle className="text-xl md:text-2xl">Surahs</CardTitle>
        </div>
        <SearchBar onSearch={onSearch} />
      </CardHeader>
      <ScrollArea className="flex-1 relative">
        <CardContent className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {filteredSurahs.length === 0 && searchQuery ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12"
              >
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm">
                  No surahs found matching &quot;{searchQuery}&quot;
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1"
              >
                {filteredSurahs.map((surah, index) => (
                  <motion.div
                    key={surah.number} // Assuming surah.number is unique
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-between group text-base h-auto py-3 ${
                        selectedSurah === surah.fullName
                          ? "bg-yellow-50 md:bg-yellow-50 font-bold text-yellow-900 hover:bg-yellow-100 border border-yellow-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => onSurahSelect(surah.fullName)}
                      data-surah={surah.fullName}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors ${
                          selectedSurah === surah.fullName
                            ? "bg-yellow-200 text-yellow-900"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}>
                          {parseInt(surah.number)}
                        </div>
                        <div className="text-left font-medium hidden md:block">
                          {surah.name}
                        </div>
                      </div>
                      <div className="md:text-left md:font-medium md:text-primary text-right font-arabic md:hidden">
                        {surah.name}
                      </div>
                      <div className="hidden md:block">
                        <ChevronRight className={`h-4 w-4 transition-all ${
                          selectedSurah === surah.fullName
                            ? "text-yellow-500 opacity-100 translate-x-0"
                            : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }`} />
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </ScrollArea>
    </>
  );
});
SurahDisplayContent.displayName = 'SurahDisplayContent'; // For better debugging

export default function SurahList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedSurah, setSelectedSurah } = useSurah();
  const [open, setOpen] = useState(false);

  // Auto-scroll to selected Surah when it changes (for shared links)
  useEffect(() => {
    if (selectedSurah) {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const surahElement = document.querySelector(`[data-surah="${selectedSurah}"]`);
        if (surahElement) {
          surahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [selectedSurah]);

  const handleSurahSelect = useCallback((surahFullName: string) => {
    setSelectedSurah(surahFullName);
    setOpen(false); // Close sheet on mobile after selection
  }, [setSelectedSurah, setOpen]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return allSurahs;
    
    const query = searchQuery.toLowerCase().trim();
    return allSurahs.filter(surah => 
      surah.name.toLowerCase().includes(query) || 
      parseInt(surah.number).toString().includes(query)
    );
  }, [searchQuery]);



  return (
    <>
      {/* mobile view */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="top-[5.5rem] left-4 z-40 flex items-center gap-2 border w-full justify-start hover:bg-gray-50"
            >
              <Menu className="h-6 w-6" />
              <div className="flex items-center gap-2">
                <span className="text-sm">Surah List</span>
                {selectedSurah && (
                  <>
                    <span className="text-gray-300 pl-1 pr-2">|</span>
                    <span className="truncate font-semibold text-sm text-primary">
                      {selectedSurah.slice(4).replace(/-/g, " ")}
                    </span>
                  </> 
                )}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="h-full flex flex-col">
              <SurahDisplayContent 
              searchQuery={searchQuery} 
              onSearch={handleSearch} 
              filteredSurahs={filteredSurahs} 
              selectedSurah={selectedSurah} 
              onSurahSelect={handleSurahSelect} 
            />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* desktop view */}
      <div className="hidden md:block h-full">
        <Card className="h-[calc(100vh-12rem)] flex flex-col border-gray-200">
          <SurahDisplayContent 
              searchQuery={searchQuery} 
              onSearch={handleSearch} 
              filteredSurahs={filteredSurahs} 
              selectedSurah={selectedSurah} 
              onSurahSelect={handleSurahSelect} 
            />
        </Card>
      </div>
    </>
  );
}

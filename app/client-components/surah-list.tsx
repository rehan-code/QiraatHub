"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { useSurah } from "@/contexts/surah-context";
import SearchBar from "./search-bar";
import { Menu, BookOpen, ChevronRight, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { allSurahs } from "../lib/surah-definitions";

export default function SurahList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedSurah, setSelectedSurah } = useSurah();
  const [open, setOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return allSurahs;
    
    const query = searchQuery.toLowerCase().trim();
    return allSurahs.filter(surah => 
      surah.name.toLowerCase().includes(query) || 
      parseInt(surah.number).toString().includes(query)
    );
  }, [searchQuery]);

  const SurahContent = () => (
    <>
      <CardHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-yellow-500" />
          <CardTitle className="text-xl md:text-2xl">Surahs</CardTitle>
        </div>
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      </CardHeader>
      <ScrollArea className="flex-1 relative">
        <CardContent className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {filteredSurahs.length === 0 ? (
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
                    key={surah.number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-between group text-sm md:text-base h-auto py-3 ${
                        selectedSurah === surah.fullName
                          ? "bg-yellow-50 text-yellow-900 hover:bg-yellow-100 border-yellow-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedSurah(surah.fullName);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                          selectedSurah === surah.fullName
                            ? "bg-yellow-200 text-yellow-900"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}>
                          {parseInt(surah.number)}
                        </div>
                        <div className="text-left font-medium">
                          {surah.name}
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-all ${
                        selectedSurah === surah.fullName
                          ? "text-yellow-500 opacity-100 translate-x-0"
                          : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }`} />
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
              <span>Surah List</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="h-full flex flex-col">
              <SurahContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* desktop view */}
      <div className="hidden md:block h-full">
        <Card className="h-[calc(100vh-14rem)] flex flex-col border-gray-200">
          <SurahContent />
        </Card>
      </div>
    </>
  );
}

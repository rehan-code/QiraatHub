"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { useSurah } from "@/contexts/surah-context";
import SearchBar from "./search-bar";
import { Menu, BookOpen, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SurahInfo {
  name: string;
  number: string;
  fullName: string;
}

export default function SurahList() {
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedSurah, setSelectedSurah } = useSurah();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("/api/surahs");
        const data = await response.json();
        const surahInfoArray = data.map((fullName: string) => {
          const match = fullName.match(/^(\d{3})\s+(.+)$/);
          if (!match) return null;
          const [, number, name] = match;
          return {
            fullName,
            number,
            name
          };
        }).filter(Boolean);
        setSurahs(surahInfoArray);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      }
    };

    fetchSurahs();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase().trim();
    return surahs.filter(surah => 
      surah.name.toLowerCase().includes(query) || 
      parseInt(surah.number).toString().includes(query)
    );
  }, [surahs, searchQuery]);

  const SurahContent = () => (
    <>
      <CardHeader className="sticky top-0 bg-background z-10 border-b pb-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-yellow-500" />
          <CardTitle className="text-xl md:text-2xl">Surahs</CardTitle>
        </div>
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-1 p-4 md:p-6">
          {filteredSurahs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No surahs found matching "{searchQuery}"
            </div>
          ) : (
            filteredSurahs.map((surah) => (
              <Button
                key={surah.number}
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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    selectedSurah === surah.fullName
                      ? "bg-yellow-200 text-yellow-900"
                      : "bg-gray-100"
                  }`}>
                    {parseInt(surah.number)}
                  </div>
                  <div className="text-left font-medium">
                    {surah.name}
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                  selectedSurah === surah.fullName
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`} />
              </Button>
            ))
          )}
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

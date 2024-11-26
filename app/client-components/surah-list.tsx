"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSurah } from "@/contexts/surah-context";
import SearchBar from "./search-bar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SurahList() {
  const [surahs, setSurahs] = useState<string[]>([]);
  const { selectedSurah, setSelectedSurah } = useSurah();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      const response = await fetch("/api/surahs");
      const data = await response.json();
      setSurahs(data);
    };

    fetchSurahs();
  }, []);

  const SurahContent = () => (
    <>
      <CardHeader className="sticky top-0 bg-background z-10">
        <CardTitle className="text-xl md:text-2xl">Surahs</CardTitle>
      </CardHeader>
      <div className="px-4 md:px-6 pb-2">
        <SearchBar />
      </div>
      <CardContent className="flex-1 overflow-y-auto min-h-0 space-y-2 px-4 md:px-6">
        {surahs.map((surah) => (
          <Button
            key={surah}
            variant="ghost"
            className={`w-full justify-start text-sm md:text-base ${
              selectedSurah === surah &&
              "bg-theme_primary text-primary hover:bg-theme_primary/80"
            }`}
            onClick={() => {
              setSelectedSurah(surah);
              setOpen(false);
            }}
          >
            {surah.slice(4)}
          </Button>
        ))}
      </CardContent>
    </>
  );

  return (
    <>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="top-[5.5rem] left-4 z-40 flex items-center gap-2 border w-full justify-start"
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
      <div className="hidden md:block h-full">
        <Card className="h-[calc(100vh-14rem)] flex flex-col">
          <SurahContent />
        </Card>
      </div>
    </>
  );
}

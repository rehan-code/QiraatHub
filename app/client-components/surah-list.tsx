"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSurah } from "@/contexts/surah-context";
import SearchBar from "./search-bar";

export default function SurahList() {
  const [surahs, setSurahs] = useState<string[]>([]);
  const { selectedSurah, setSelectedSurah } = useSurah();

  useEffect(() => {
    const fetchSurahs = async () => {
      const response = await fetch("/api/surahs");
      const data = await response.json();
      console.log(data);
      setSurahs(data);
    };

    fetchSurahs();
  }, []);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">Surahs</CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <SearchBar />
      </div>
      <CardContent className="space-y-2">
        {surahs.map((surah) => (
          <Button
            key={surah}
            className={`w-full justify-start ${
              selectedSurah === surah &&
              "bg-theme_primary text-primary hover:bg-theme_primary/80"
            }`}
            onClick={() => setSelectedSurah(surah)}
          >
            {surah.slice(4)}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

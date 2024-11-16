"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSurah } from "@/contexts/surah-context";

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
      <CardContent className="space-y-2">
        {surahs.map((surah, index) => (
          <Button
            key={surah}
            className={`w-full justify-start ${
              selectedSurah === surah && "bg-theme_primary text-primary"
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

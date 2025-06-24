"use client";

import { Button } from "@/components/ui/button";
import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";

export default function QiraatButtons() {
  const [qiraat, setQiraat] = useState<string[]>([]);
  const { selectedSurah, selectedQiraat, setSelectedQiraat } = useSurah();

  useEffect(() => {
    const fetchQiraat = async () => {
      if (!selectedSurah) {
        setQiraat([]);
        return;
      }
      try {
        const response = await fetch(`/api/list-qiraat?surah=${selectedSurah}`);
        if (!response.ok) {
          console.error(
            "Failed to fetch Qira'at list from /api/list-qiraat:",
            response.status,
            response.statusText
          );
          setQiraat([]);
          return;
        }
        const data = await response.json();
        setQiraat(data);
      } catch (error) {
        console.error("Error fetching Qira'at list:", error);
        setQiraat([]);
      }
    };

    fetchQiraat();
  }, [selectedSurah]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {qiraat.map((style) => (
        <Button
          key={style}
          variant={"outline"}
          className={`px-4 md:px-8 py-4 md:py-6 text-base md:text-lg font-medium md:font-semibold ${
            selectedQiraat === style &&
            "bg-theme_primary text-white hover:bg-theme_primary/80"
          }`}
          onClick={() => setSelectedQiraat(style)}
        >
          {style}
        </Button>
      ))}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";

export default function QiraatButtons() {
  const [qiraat, setQiraat] = useState<string[]>([]);
  const { selectedSurah, selectedQiraat, setSelectedQiraat } = useSurah();

  useEffect(() => {
    const fetchQiraat = async () => {
      const response = await fetch(`/api/qiraat?surah=${selectedSurah}`);
      const data = await response.json();
      console.log(data);
      setQiraat(data);
    };

    fetchQiraat();
  }, [selectedSurah]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {qiraat.map((style) => (
        <Button
          key={style}
          variant={"outline"}
          className={`px-8 py-6 text-lg font-semibold ${
            selectedQiraat === style &&
            "bg-theme_primary text-primary hover:bg-theme_primary/80"
          }`}
          onClick={() => setSelectedQiraat(style)}
        >
          {style}
        </Button>
      ))}
    </div>
  );
}

"use client";

import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";
import { Loader2 } from "lucide-react";

export default function AudioPlayers() {
  const { selectedSurah, selectedQiraat } = useSurah();
  const [pathList, setPathList] = useState<Array<{ reciter: string; audioUrl: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedSurah || !selectedQiraat) {
      setPathList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchRecitersAndSetPaths = async () => {
      try {
        const response = await fetch(
          `/api/list-reciters?surah=${selectedSurah}&qiraat=${selectedQiraat}`
        );
        if (!response.ok) {
          console.error(
            "Failed to fetch reciter list from /api/list-reciters:",
            response.status,
            response.statusText
          );
          setPathList([]);
          setLoading(false);
          return;
        }
        // API now returns Array<{ reciter: string, audioFilename: string }>
        const recitersInfo: Array<{ reciter: string; audioFilename: string }> = await response.json();

        const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL_BASE;
        if (!r2BaseUrl) {
          console.error(
            "Error: NEXT_PUBLIC_R2_PUBLIC_URL_BASE is not defined in environment variables."
          );
          setPathList([]);
          setLoading(false);
          return;
        }

        const newPathList = recitersInfo
          .map((info) => {
            if (!info.reciter || !info.audioFilename) {
              console.warn("Received incomplete reciter info:", info);
              return null; // Skip this entry if data is incomplete
            }
            return {
              reciter: info.reciter,
              audioUrl: `${r2BaseUrl}/${selectedSurah}/${selectedQiraat}/${encodeURIComponent(info.reciter)}/${info.audioFilename}`,
            };
          })
          .filter(Boolean) as Array<{ reciter: string; audioUrl: string }>; // Explicitly cast to remove nulls for TypeScript

        setPathList(newPathList);
      } catch (error) {
        console.error("Error fetching or processing reciter list:", error);
        setPathList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecitersAndSetPaths();
  }, [selectedSurah, selectedQiraat]);

  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <Loader2 className="h-10 w-10 self-center animate-spin" />
      ) : (
        pathList.map(({ reciter, audioUrl }, index) => (
          <AudioPlayer
            key={`${selectedSurah} ${selectedQiraat} ${reciter} ${index}`}
            filePath={audioUrl}
            reciter={reciter}
          />
        ))
      )}
    </div>
  );
}

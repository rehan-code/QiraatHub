"use client";

import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";
import { Loader2 } from "lucide-react";

export default function AudioPlayers() {
  const { selectedSurah, selectedQiraat } = useSurah();
  const [pathList, setPathList] = useState<Array<{ reciter: string; audioUrl: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [sharedReciter, setSharedReciter] = useState<string | null>(null);

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

  // Check for shared reciter from sessionStorage when pathList loads
  useEffect(() => {
    if (pathList.length > 0) {
      const sharedReciter = sessionStorage.getItem('sharedReciter');
      if (sharedReciter) {
        // Check if the shared reciter exists in the current pathList
        const reciterExists = pathList.some(item => item.reciter === sharedReciter);
        if (reciterExists) {
          setSharedReciter(sharedReciter);
          sessionStorage.removeItem('sharedReciter'); // Clean up after use
        }
        // If not found, keep sessionStorage value for when correct Qiraat loads
      }
    }
  }, [pathList, selectedSurah, selectedQiraat]);

  // Auto-scroll to shared reciter when it's set
  useEffect(() => {
    if (sharedReciter && pathList.length > 0) {
      const reciterIndex = pathList.findIndex(item => item.reciter === sharedReciter);
      if (reciterIndex !== -1) {
        // Scroll to the reciter after a delay to ensure rendering is complete
        setTimeout(() => {
          const reciterElement = document.querySelector(`[data-reciter="${sharedReciter}"]`);
          if (reciterElement) {
            reciterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a subtle highlight effect
            reciterElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
            setTimeout(() => {
              reciterElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
            }, 2000);
          }
        }, 800); // Optimized delay - faster but still reliable
        
        // Clear the shared reciter after scrolling
        setTimeout(() => setSharedReciter(null), 2500);
      } else {
        // Reciter not found, clear the shared state
        setSharedReciter(null);
      }
    }
  }, [sharedReciter, pathList]);

  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <Loader2 className="h-10 w-10 self-center animate-spin" />
      ) : (
        pathList.map(({ reciter, audioUrl }, index) => (
          <div key={`${selectedSurah} ${selectedQiraat} ${reciter} ${index}`} data-reciter={reciter}>
            <AudioPlayer
              filePath={audioUrl}
              reciter={reciter}
            />
          </div>
        ))
      )}
    </div>
  );
}

"use client";

import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";
import { Loader2 } from "lucide-react";

export default function AudioPlayers() {
  const { selectedSurah, selectedQiraat } = useSurah();
  const [pathList, setPathList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(" players loading");
    setLoading(true);
    const get_files = async () => {
      const response = await fetch(
        `/api/surah-files?surah=${selectedSurah}&qiraat=${selectedQiraat}`
      );
      const data = await response.json();
      console.log(data);
      setPathList(data);

      setLoading(false);
      console.log(" players loading comp");
    };
    get_files();
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

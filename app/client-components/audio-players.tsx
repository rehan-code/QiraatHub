"use client";

import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";

export default function AudioPlayers() {
  const { selectedSurah, selectedQiraat } = useSurah();
  const [pathList, setPathList] = useState([]);

  useEffect(() => {
    const get_files = async () => {
      const response = await fetch(
        `/api/surah-files?surah=${selectedSurah}&qiraat=${selectedQiraat}`
      );
      const data = await response.json();
      console.log(data);
      setPathList(data);
    };
    get_files();
  }, [selectedSurah, selectedQiraat]);

  return (
    <div className="flex flex-col gap-3">
      {pathList.map(({ reciter, audioUrl }, index) => (
        <AudioPlayer
          key={`${selectedSurah} ${selectedQiraat} ${reciter} ${index}`}
          filePath={audioUrl}
          reciter={reciter}
        />
      ))}
    </div>
  );
}

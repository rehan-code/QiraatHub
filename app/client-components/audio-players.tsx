"use client";

import { useSurah } from "@/contexts/surah-context";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";

export default function AudioPlayers() {
  const { selectedSurah, selectedQiraat } = useSurah();
  const [pathList, setPathList] = useState([]);

  useEffect(() => {
    const fetchPaths = async () => {
      const response = await fetch(
        `/api/filePath?surah=${selectedSurah}&qiraat=${selectedQiraat}`
      );
      const data = await response.json();
      console.log(data);
      setPathList(data);
    };
    fetchPaths();
  }, [selectedSurah, selectedQiraat]);

  return (
    <div className="flex flex-col gap-3">
      {pathList.map(({ path, reciter }, index) => (
        <AudioPlayer key={index} filePath={path} reciter={reciter} />
      ))}
    </div>
  );
}

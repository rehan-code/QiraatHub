"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Maximize2,
  Volume2,
  Loader2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSurah } from "@/contexts/surah-context";

export default function AudioPlayer({
  filePath,
  reciter,
}: {
  filePath?: string;
  reciter?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [path] = useState(filePath == undefined ? "" : filePath);
  const { selectedSurah } = useSurah();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);

  // get file path from server if not supplied
  // useEffect(() => {
  //   if (path == "") {
  //     const fetchPath = async () => {
  //       const response = await fetch(
  //         `/api/filePath?surah=${selectedSurah}&qiraat=${selectedQiraat}`
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //       setPath(data[0]["path"]);
  //     };
  //     fetchPath();
  //     setIsPlaying(false);
  //   }
  // }, [selectedSurah, selectedQiraat, path]);

  useEffect(() => {
    setLoading(true);
    console.log(path);
    if (path != "") {
      audioRef.current = new Audio(path);

      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener("canplay", () => {
        if (audioRef.current?.readyState != 0) {
          setLoading(false);
        }
      });

      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      return () => {
        audioRef.current?.pause();
        audioRef.current = null;
      };
    }
  }, [path]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-[800px] mx-auto">
      <CardContent>
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8">
              {reciter ? `${reciter}` : selectedSurah.slice(4)}
            </h2>
            <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
              <Button size="icon" variant="ghost" className="hidden sm:flex">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hidden sm:flex">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary/90"
                onClick={togglePlayPause}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5 sm:ml-1" />
                )}
              </Button>
              <Button size="icon" variant="ghost" className="hidden sm:flex">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hidden sm:flex">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 sm:space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="cursor-pointer"
              onValueChange={([value]) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = value;
                  setCurrentTime(value);
                }
              }}
            />
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <Slider
              defaultValue={[75]}
              max={100}
              step={1}
              className="w-[80px] sm:w-[120px]"
              onValueChange={([value]) => {
                if (audioRef.current) {
                  audioRef.current.volume = value / 100;
                }
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

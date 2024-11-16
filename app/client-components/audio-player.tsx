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
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSurah } from "@/contexts/surah-context";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { selectedSurah, selectedQiraat } = useSurah();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(
      `/audio/${selectedSurah}/${selectedQiraat}/aaar-al-hudhoudi/001.mp3`
    );

    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current?.duration || 0);
    });

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

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
    <Card className="">
      <CardContent>
        <div className="space-y-6 p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Al-Qaria</h2>
            <div className="flex justify-center gap-4 mb-8">
              <Button size="icon" variant="ghost" className="">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              <Button size="icon" variant="ghost" className="">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
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
            <div className="flex justify-between text-sm ">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 " />
            <Slider
              defaultValue={[75]}
              max={100}
              step={1}
              className="w-[120px]"
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

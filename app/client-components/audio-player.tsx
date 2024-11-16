"use client";

import { useState } from "react";
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

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

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
                onClick={() => setIsPlaying(!isPlaying)}
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
              defaultValue={[0]}
              max={100}
              step={1}
              className="cursor-pointer"
              onValueChange={([value]) => setCurrentTime(value)}
            />
            <div className="flex justify-between text-sm ">
              <span>00:00</span>
              <span>00:40</span>
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

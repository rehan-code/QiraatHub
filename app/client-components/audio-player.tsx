"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  // Shuffle,
  // SkipBack,
  Play,
  Pause,
  // SkipForward,
  // Maximize2,
  Volume2,
  Loader2,
  Download,
  Share2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSurah } from "@/contexts/surah-context";
import { toast } from '@/components/ui/use-toast';

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
  const [isMobile, setIsMobile] = useState(false);
  const [path] = useState(filePath == undefined ? "" : filePath);
  const { selectedSurah, selectedQiraat } = useSurah();
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
    // Check if it's a mobile device
    const mobileCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobileCheck);

    setLoading(true);
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

  const handleDownload = async () => {
    try {
      // Create a meaningful filename
      const filename = `${selectedSurah?.replace(/\s+/g, '_')}_${reciter?.replace(/\s+/g, '_') || 'Unknown_Reciter'}.mp3`;
      
      // Use our API route to download the file
      const downloadUrl = `/api/download-audio?url=${encodeURIComponent(path)}&filename=${encodeURIComponent(filename)}`;
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback: open in new tab
      window.open(path, '_blank');
    }
  };

  const handleShare = async () => {
    try {
      // Get current URL and add query parameters for the specific audio
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('surah', selectedSurah || '');
      currentUrl.searchParams.set('qiraat', selectedQiraat || '');
      currentUrl.searchParams.set('reciter', reciter || '');
      
      const shareUrl = currentUrl.toString();
      const shareData = {
        title: `${selectedSurah} - ${reciter}`,
        text: `Listen to ${selectedSurah} recited by ${reciter} on QiraatHub`,
        url: shareUrl,
      };

      // Check if Web Share API is available (mainly on mobile)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
      }
    } catch {
      // Fallback: try to copy to clipboard
      try {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('surah', selectedSurah || '');
        currentUrl.searchParams.set('qiraat', selectedQiraat || '');
        currentUrl.searchParams.set('reciter', reciter || '');
        await navigator.clipboard.writeText(currentUrl.toString());
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError);
        toast({
          title: "Share failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardContent>
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0 relative">
          {/* Mobile Action Buttons - Top Right Corner */}
          {isMobile && (
            <div className="absolute -top-6 -right-2 z-10 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full hover:bg-muted/60 opacity-70 hover:opacity-100 transition-opacity"
                onClick={handleShare}
                disabled={loading}
                title="Share audio"
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full hover:bg-muted/60 opacity-70 hover:opacity-100 transition-opacity"
                onClick={handleDownload}
                disabled={loading || !path}
                title="Download audio"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* Main Content */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold">
              {reciter ? reciter : "Reciter"}
            </h2>
            <p className="text-base text-muted-foreground mb-4 sm:mb-8">
              {selectedSurah ? selectedSurah.slice(4).replace(/-/g, ' ') : "Surah"}
            </p>
            
            {/* Play Button - Centered */}
            <div className="flex justify-center mb-4 sm:mb-8">
              <Button
                size="icon"
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                onClick={togglePlayPause}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
                ) : (
                  <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-0.5 sm:ml-1" />
                )}
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
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Desktop Bottom Controls - Volume & Action Buttons */}
          {!isMobile && (
            <div className="flex items-center justify-between">
              {/* Volume Control - Left */}
              <div className="flex items-center gap-2">
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
              
              {/* Action Buttons - Right */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-full"
                  onClick={handleShare}
                  disabled={loading}
                  title="Share audio"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-full"
                  onClick={handleDownload}
                  disabled={loading || !path}
                  title="Download audio"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

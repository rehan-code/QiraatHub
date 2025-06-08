'use client';

import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { Slider } from '@/components/ui/slider'; // Import shadcn/ui Slider

interface RadioPlayerProps {
  streamUrl: string;
  stationName?: string;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ streamUrl, stationName = 'Live Radio' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume); // Update UI state for slider position

    if (audioRef.current) {
      audioRef.current.volume = newVolume; // Set actual audio volume

      if (newVolume > 0) {
        if (audioRef.current.muted) { // If it was muted and volume is now > 0
          audioRef.current.muted = false; // Unmute the audio element
        }
        setIsMuted(false); // Update the muted state for UI
      } else { // newVolume is 0
        if (!audioRef.current.muted) { // If it was not muted and volume is now 0
          audioRef.current.muted = true; // Mute the audio element
        }
        setIsMuted(true); // Update the muted state for UI
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const currentMuted = !audioRef.current.muted;
      audioRef.current.muted = currentMuted;
      setIsMuted(currentMuted);
      // If unmuting and volume was 0, set to a default volume (e.g., 0.5)
      // Otherwise, if muting, the visual volume can remain, or be set to 0
      if (!currentMuted && audioRef.current.volume === 0) {
        setVolume(0.5); // Or previous non-zero volume
        audioRef.current.volume = 0.5;
      }
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 w-[350px] bg-slate-800 text-slate-100 rounded-xl p-4 shadow-xl z-[1000] font-sans transition-transform duration-300 ease-in-out hover:-translate-y-1"
    >
      <audio ref={audioRef} preload="none" onVolumeChange={() => {
        if(audioRef.current) {
          setVolume(audioRef.current.volume);
          setIsMuted(audioRef.current.muted);
        }
      }} />
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlayPause}
          className="bg-transparent border-none text-slate-100 cursor-pointer p-2 rounded-full transition-colors duration-200 ease-linear hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        <div className="text-center flex-grow mx-3 overflow-hidden">
          <p className="text-sm font-semibold truncate">
            {stationName}
          </p>
          {isPlaying && <p className="text-xs text-slate-400 m-0">Now Playing</p>}
          {!isPlaying && <p className="text-xs text-slate-400 m-0">Paused</p>}
        </div>
        <div className="flex items-center w-28">
          <button
            onClick={toggleMute}
            className="bg-transparent border-none text-slate-100 cursor-pointer p-2 rounded-full transition-colors duration-200 ease-linear hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 mr-2"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
      {/* <style jsx> block removed as shadcn/ui Slider handles its own styling */}
    </div>
  );
};

export default RadioPlayer;


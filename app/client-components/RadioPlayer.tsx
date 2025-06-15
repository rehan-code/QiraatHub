'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// This interface should match the one in your API route
interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
}

const RadioPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch tracks from the API on component mount
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/radio/tracks');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch tracks');
        }
        const data: Track[] = await response.json();
        if (data && data.length > 0) {
          setTracks(data);
        } else {
          setError('No tracks available.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracks();
  }, []);

  // Effect to handle playing audio when track or isPlaying state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && tracks.length > 0) {
        const trackUrl = tracks[currentTrackIndex].url;
        if (audioRef.current.src !== trackUrl) {
          audioRef.current.src = trackUrl;
        }
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying, tracks]);

  const handlePlayPause = () => {
    if (tracks.length === 0) return;
    setIsPlaying(!isPlaying);
  };

  const playNextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex(prevIndex => (prevIndex + 1) % tracks.length);
  };

  const playPreviousTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex(prevIndex => (prevIndex - 1 + tracks.length) % tracks.length);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const currentlyMuted = !audioRef.current.muted;
      audioRef.current.muted = currentlyMuted;
      setIsMuted(currentlyMuted);
      if (!currentlyMuted && volume === 0) {
        setVolume(0.5);
        audioRef.current.volume = 0.5;
      }
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  const mainContent = () => {
    if (isLoading) {
      return <p className="text-sm text-yellow-300">Loading Radio...</p>;
    }
    if (error) {
      return <p className="text-sm text-red-400">Error: {error}</p>;
    }
    if (!currentTrack) {
      return <p className="text-sm text-yellow-300">No tracks loaded.</p>;
    }

    return (
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center">
          <button onClick={playPreviousTrack} disabled={tracks.length <= 1} className="p-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Previous Track"><SkipBack size={20} fill="currentColor" /></button>
          <button onClick={handlePlayPause} className="p-2 mx-2 rounded-full hover:bg-yellow-600" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button onClick={playNextTrack} disabled={tracks.length <= 1} className="p-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Next Track"><SkipForward size={20} fill="currentColor" /></button>
        </div>

        {/* Track Info */}
        <div className="text-center flex-grow mx-3 overflow-hidden">
          <p className="text-sm font-semibold truncate" title={currentTrack.title}>{currentTrack.title}</p>
          <p className="text-xs text-yellow-300 m-0 truncate" title={currentTrack.artist}>{currentTrack.artist || 'Unknown Artist'}</p>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center w-28">
          <button onClick={toggleMute} className="p-2 rounded-full hover:bg-yellow-600 mr-2" aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <VolumeX size={20} fill="currentColor" /> : <Volume2 size={20} fill="currentColor" />}
          </button>
          <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 w-[400px] bg-yellow-700 text-white rounded-xl p-4 shadow-xl z-[1000] font-sans">
      <audio
        ref={audioRef}
        onEnded={playNextTrack}
        onVolumeChange={() => {
          if (audioRef.current) {
            setVolume(audioRef.current.volume);
            setIsMuted(audioRef.current.muted);
          }
        }}
        preload="auto"
      />
      {mainContent()}
    </div>
  );
};

export default RadioPlayer;


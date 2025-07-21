'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// This interface should match the one in your API and now-playing route
interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

interface NowPlayingData {
  currentTrack: Track | null;
  currentTime: number;
  serverTime: number;
  playlistTotalDuration: number;
}

const RadioPlayer = () => {
  // const [tracks, setTracks] = useState<Track[]>([]); // Full playlist, might be fetched separately if needed for UI
  // const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Helper function to play audio (defined outside hooks)
  const playAudio = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error("Playback was prevented:", error);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Basic check for mobile devices (touch-enabled)
    const mobileCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobileCheck);
  }, []);

  // Track if we're currently fetching to prevent multiple concurrent requests
  const isFetchingRef = useRef<boolean>(false);
  // Track last successful fetch time to prevent too frequent fetches
  const lastFetchTimeRef = useRef<number>(0);
  // Minimum time between fetches in milliseconds (5 seconds)
  const MIN_FETCH_INTERVAL = 5000;

  // Memoize fetchNowPlaying to stabilize its identity for useEffect dependencies
  const fetchNowPlaying = React.useCallback(async (shouldAutoPlay: boolean = false) => {
    // Prevent concurrent fetches and rate limit
    const now = Date.now();
    if (isFetchingRef.current || (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL)) {
      return;
    }
    
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetch('/api/radio/now-playing');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch now playing info');
      }
      const data: NowPlayingData = await response.json();
      lastFetchTimeRef.current = now;
      setNowPlaying(data);
      setError(null);

      if (data.currentTrack && audioRef.current) {
        // Only change the source if it's different
        if (audioRef.current.src !== data.currentTrack.url) {
          console.log('Changing track to:', data.currentTrack.title);
          audioRef.current.src = data.currentTrack.url;
        }
        
        // Only update time if we're not playing or if we need to sync a new track
        // For playing tracks, avoid touching currentTime to prevent interruptions
        if (!isPlaying && audioRef.current.paused) {
          // Adjust for potential latency between server calculation and client fetch
          const clientTimeAtFetch = Date.now();
          const serverTimeDeltaMs = clientTimeAtFetch - data.serverTime;
          const adjustedCurrentTime = data.currentTime + (serverTimeDeltaMs / 1000);
          
          // Ensure currentTime is not beyond track duration
          const trackDuration = data.currentTrack.duration || Infinity;
          audioRef.current.currentTime = Math.max(0, Math.min(adjustedCurrentTime, trackDuration - 0.1));
        }

        if (shouldAutoPlay) {
          setIsPlaying(true);
        }
      } else if (!data.currentTrack) {
        setError('No track currently scheduled.');
        setIsPlaying(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Don't clear nowPlaying on error to prevent UI flickering
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [setIsLoading, setNowPlaying, setError, setIsPlaying /* audioRef is stable. isPlaying was removed from deps */]);

  useEffect(() => {
    // Fetch initial track info to display, but don't autoplay
    fetchNowPlaying(false);
    
    // Set up a timer to re-sync periodically but only when NOT playing
    // This prevents any interruption during playback
    const intervalId = setInterval(() => {
      // Only fetch if we're not currently playing to avoid interruptions
      if (audioRef.current?.paused) {
        fetchNowPlaying(false);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchNowPlaying]);

  // Effect to handle playing/pausing audio based on isPlaying state
  useEffect(() => {
    // Only proceed if we have audio element and track data
    if (!audioRef.current || !nowPlaying?.currentTrack) return;

    if (isPlaying) {
      // Make sure we have the right track loaded
      if (audioRef.current.src !== nowPlaying.currentTrack.url) {
        audioRef.current.src = nowPlaying.currentTrack.url;
        // Allow a moment for the new source to load before playing
        setTimeout(playAudio, 100);
      } else {
        // Already has correct source, just play
        playAudio();
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, nowPlaying]);

  const handlePlayPause = () => {
    if (!nowPlaying?.currentTrack) return;

    if (!isPlaying) {
      // If currently paused, re-sync and then play
      fetchNowPlaying(true);
    } else {
      // If currently playing, just pause
      setIsPlaying(false);
    }
  };

  // Called when audio track ends
  const handleTrackEnd = () => {
    // Add a small delay before fetching to prevent rapid successive fetches
    setTimeout(() => fetchNowPlaying(true), 500); 
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

  const currentTrack = nowPlaying?.currentTrack;

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

          <button onClick={handlePlayPause} className="p-2 mx-2 rounded-full hover:bg-yellow-600" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>

        </div>

        {/* Track Info */}
        <div className="text-center flex-grow mx-3 overflow-hidden">
          <p className="text-sm font-semibold truncate" title={currentTrack.title}>{currentTrack.title}</p>
          <p className="text-xs text-yellow-300 m-0 truncate" title={currentTrack.artist}>{currentTrack.artist || 'Unknown Artist'}</p>
        </div>

        {/* Right side content: Spacer on mobile, Volume on desktop */}
        {isMobile ? (
          // Placeholder to balance the play button and center the text.
          // The width should roughly match the play button's container width (p-2 + mx-2 + icon size).
          <div className="w-14" />
        ) : (
          // Volume Controls for desktop
          <div className="flex items-center w-28">
            <button onClick={toggleMute} className="p-2 rounded-full hover:bg-yellow-600 mr-2" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted || volume === 0 ? <VolumeX size={20} fill="currentColor" /> : <Volume2 size={20} fill="currentColor" />}
            </button>
            <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-full" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed right-2 bottom-2 w-[calc(100%-1rem)] md:w-[400px] md:bottom-5 md:right-5 md:transform-none bg-yellow-700 text-white rounded-xl md:p-4 p-3 shadow-xl z-10 font-sans">
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        onError={(e) => {
          console.error('Audio playback error:', e);
          // Don't immediately try to fetch on error - this can cause request loops
          // Instead, set an error state that the user can see
          setError('Error playing audio. Please try again.');
        }}
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

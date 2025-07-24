'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
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
  currentTime?: number; // Optional - only present when fetched from now-playing API
  serverTime?: number; // Optional - only present when fetched from now-playing API
  playlistTotalDuration?: number; // Optional - only present when fetched from now-playing API
}

const RadioPlayer = () => {
  // const [tracks, setTracks] = useState<Track[]>([]); // Full playlist, might be fetched separately if needed for UI
  // const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayLoading, setIsPlayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Helper function to play audio (defined outside hooks)
  const playAudio = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      // Clear play loading only after successful play
      setIsPlayLoading(false);
    } catch {
      setIsPlaying(false);
      setIsPlayLoading(false);
    }
  };

  // Track if we're currently fetching to prevent multiple concurrent requests
  const isFetchingRef = useRef<boolean>(false);
  // Track last successful fetch time to prevent too frequent fetches
  const lastFetchTimeRef = useRef<number>(0);
  // Minimum time between fetches in milliseconds (5 seconds)
  const MIN_FETCH_INTERVAL = 5000;

  // Fetch current track info (no timing data) for initial display
  const fetchCurrentTrack = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/radio/current-track');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch current track info');
      }
      const data = await response.json();
      // Set nowPlaying with just the current track (no timing data)
      setNowPlaying({
        currentTrack: data.currentTrack,
        // timing fields are undefined for current-track API
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Basic check for mobile devices (touch-enabled)
    const mobileCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobileCheck);
    
    // Fetch initial track info on component mount
    fetchCurrentTrack();
  }, [fetchCurrentTrack]);

  // Fetch now playing data with timing info and start playing
  const fetchNowPlayingAndPlay = React.useCallback(async () => {
    // Prevent concurrent fetches and rate limit
    const now = Date.now();
    if (isFetchingRef.current || (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL)) {
      setIsPlayLoading(false);
      return;
    }
    
    isFetchingRef.current = true;

    try {
      const response = await fetch('/api/radio/now-playing');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch now playing info');
      }
      const data: NowPlayingData = await response.json();
      lastFetchTimeRef.current = now;
      // Update nowPlaying with full timing data
      setNowPlaying({
        currentTrack: data.currentTrack,
        currentTime: data.currentTime,
        serverTime: data.serverTime,
        playlistTotalDuration: data.playlistTotalDuration,
      });
      setError(null);

      if (data.currentTrack && audioRef.current && data.currentTime !== undefined) {
        // Convert from API milliseconds to seconds for audio element
        const syncPositionMs = data.currentTime; // In milliseconds from the API
        const syncPositionSec = syncPositionMs / 1000; // Convert to seconds for the audio element
        
        // Only do sync logic if we have timing data (from now-playing API)
        if (data.currentTime !== undefined) {
          // If the source URL has changed, we need to set a new track
          if (audioRef.current.src !== data.currentTrack.url) {
            audioRef.current.src = data.currentTrack.url;
            audioRef.current.currentTime = syncPositionSec;
          } else {
            // For same track, only sync if we're significantly out of sync (>3 seconds difference)
            // or if we're not actively playing (to avoid interruptions)
            const timeDrift = Math.abs(audioRef.current.currentTime - syncPositionSec);
            if (!isPlaying || audioRef.current.paused || timeDrift > 3) {
              audioRef.current.currentTime = syncPositionSec;
            }
          }
        }

        // Always set playing to true when this function is called
        setIsPlaying(true);
      } else if (!data.currentTrack) {
        setError('No track currently scheduled.');
        setIsPlaying(false);
        setIsPlayLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsPlaying(false);
      setIsPlayLoading(false);
      // Don't clear nowPlaying on error to prevent UI flickering
    } finally {
      isFetchingRef.current = false;
    }
  }, [setNowPlaying, setError, setIsPlaying, isPlaying /* audioRef is stable */]);

  useEffect(() => {
    // Fetch initial track info to display
    fetchCurrentTrack();
    
    // Set up a timer to re-sync periodically but only when NOT playing
    // This prevents any interruption during playback
    const intervalId = setInterval(() => {
      // Only fetch if we're not currently playing to avoid interruptions
      if (audioRef.current?.paused) {
        fetchCurrentTrack();
      }
    }, 60000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchCurrentTrack]);

  // Effect to handle playing/pausing audio based on isPlaying state
  useEffect(() => {
    // Only proceed if we have audio element and track data
    if (!audioRef.current || !nowPlaying?.currentTrack) {
      // Clear play loading if we don't have the necessary data and not currently loading initial data
      if (isPlayLoading && !isLoading) {
        setIsPlayLoading(false);
      }
      return;
    }

    if (isPlaying) {
      // Only proceed if we have timing data (from now-playing API)
      if (nowPlaying.currentTime !== undefined) {
        // Make sure we have the right track loaded
        if (audioRef.current.src !== nowPlaying.currentTrack.url) {
          audioRef.current.src = nowPlaying.currentTrack.url;
          // Allow a moment for the new source to load before playing
          setTimeout(playAudio, 100);
        } else {
          // Already has correct source, just play
          playAudio();
        }
      }
    } else {
      audioRef.current.pause();
      // Don't clear play loading here - let it be cleared by the play attempt or user action
    }
  }, [isPlaying, nowPlaying, isPlayLoading, isLoading]);

  const handlePlayPause = async () => {
    // Prevent multiple clicks while loading
    if (isPlayLoading || isLoading) return;
    
    // If no current track info, can't play
    if (!nowPlaying?.currentTrack) {
      return;
    }

    if (!isPlaying) {
      setIsPlayLoading(true);
      try {
        // Fetch timing data and start playing
        await fetchNowPlayingAndPlay();
      } catch {
        setIsPlayLoading(false);
      }
    } else {
      // If currently playing, just pause
      setIsPlaying(false);
    }
  };

  // Called when audio track ends
  const handleTrackEnd = () => {
    // When track ends, fetch new timing data and start playing next track
    setTimeout(() => {
      setIsPlayLoading(true);
      fetchNowPlayingAndPlay();
    }, 500); 
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
          <button 
            onClick={handlePlayPause} 
            className="p-2 mx-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed" 
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={isPlayLoading}
          >
            {isPlayLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
        </div>

        {/* Track Info */}
        <div className="text-center flex-grow mx-3 overflow-hidden">
          <p className="text-md md:text-sm font-semibold truncate" title={currentTrack.title}>{currentTrack.title}</p>
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
        onError={() => {
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

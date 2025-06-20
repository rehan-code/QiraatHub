// app/api/radio/now-playing/route.ts
import { NextResponse } from 'next/server';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

export interface NowPlayingResponse {
  currentTrack: Track | null;
  currentTime: number; // Playback time in seconds within the currentTrack
  serverTime: number; // UTC milliseconds timestamp of when this was calculated
  playlistTotalDuration: number;
}

const R2_PUBLIC_URL_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL_BASE;
const PLAYLIST_FILENAME = 'playlist.json';

// This endpoint should not be heavily cached by downstream caches if we want near real-time sync.
// Next.js fetch caching is handled per-request or via revalidate on the fetch call itself.
// For Vercel, responses from this function are not cached by default unless a Cache-Control header is set.

async function fetchPlaylist(): Promise<Track[]> {
  if (!R2_PUBLIC_URL_BASE) {
    console.error('CRITICAL: Missing R2_PUBLIC_URL_BASE environment variable in now-playing.');
    throw new Error('Server configuration error: R2_PUBLIC_URL_BASE is not set.');
  }
  const playlistUrl = `${R2_PUBLIC_URL_BASE}/${PLAYLIST_FILENAME}`;

  const response = await fetch(playlistUrl, { cache: 'no-store' }); // Fetch fresh playlist

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error fetching playlist from R2 in now-playing: ${response.status} ${response.statusText}`, { errorText });
    throw new Error('Failed to fetch playlist from storage for now-playing.');
  }
  return response.json();
}

export async function GET() {
  const serverTime = Date.now(); // UTC milliseconds

  try {
    const tracks = await fetchPlaylist();

    if (!tracks || tracks.length === 0) {
      return NextResponse.json<NowPlayingResponse>({
        currentTrack: null,
        currentTime: 0,
        serverTime,
        playlistTotalDuration: 0,
      });
    }

    const playlistTotalDuration = tracks.reduce((total, track) => total + (track.duration || 0), 0);

    if (playlistTotalDuration === 0) {
      // If total duration is zero (e.g., missing durations), return the first track at the beginning.
      return NextResponse.json<NowPlayingResponse>({
        currentTrack: tracks[0],
        currentTime: 0,
        serverTime,
        playlistTotalDuration: 0,
      });
    }

    // Calculate current position in the entire playlist loop (in seconds)
    const currentGlobalTimeSeconds = (serverTime / 1000) % playlistTotalDuration;

    let cumulativeDuration = 0;
    let currentTrack: Track | null = null;
    let currentTimeInTrack = 0;

    for (const track of tracks) {
      const trackDuration = track.duration || 0;
      if (currentGlobalTimeSeconds >= cumulativeDuration && currentGlobalTimeSeconds < cumulativeDuration + trackDuration) {
        currentTrack = track;
        currentTimeInTrack = currentGlobalTimeSeconds - cumulativeDuration;
        break;
      }
      cumulativeDuration += trackDuration;
    }

    // Fallback if something went wrong (should not happen if playlistTotalDuration > 0)
    if (!currentTrack && tracks.length > 0) {
      currentTrack = tracks[0];
      currentTimeInTrack = 0;
    }
    
    return NextResponse.json<NowPlayingResponse>({
      currentTrack,
      currentTime: currentTimeInTrack,
      serverTime,
      playlistTotalDuration,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in /api/radio/now-playing:', errorMessage);
    return NextResponse.json<NowPlayingResponse>(
      { currentTrack: null, currentTime: 0, serverTime, playlistTotalDuration: 0 }, 
      { status: 500, statusText: 'Failed to calculate now playing info.' }
    );
  }
}

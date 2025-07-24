// app/api/radio/current-track/route.ts
import { NextResponse } from 'next/server';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

export interface CurrentTrackResponse {
  currentTrack: Track | null;
}

const R2_PUBLIC_URL_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL_BASE;
const PLAYLIST_FILENAME = 'playlist.json';

async function fetchPlaylist(): Promise<Track[]> {
  if (!R2_PUBLIC_URL_BASE) {
    console.error('CRITICAL: Missing R2_PUBLIC_URL_BASE environment variable in current-track.');
    throw new Error('Server configuration error: R2_PUBLIC_URL_BASE is not set.');
  }
  const playlistUrl = `${R2_PUBLIC_URL_BASE}/${PLAYLIST_FILENAME}`;

  const response = await fetch(playlistUrl, { cache: 'no-store' }); // Fetch fresh playlist

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error fetching playlist from R2 in current-track: ${response.status} ${response.statusText}`, { errorText });
    throw new Error('Failed to fetch playlist from storage for current-track.');
  }
  return response.json();
}

export async function GET() {
  const serverTime = Date.now(); // UTC milliseconds

  try {
    const tracks = await fetchPlaylist();

    if (!tracks || tracks.length === 0) {
      return NextResponse.json<CurrentTrackResponse>({
        currentTrack: null,
      });
    }

    // Sum up durations from playlist (all in milliseconds)
    const playlistTotalDuration = tracks.reduce((total, track) => total + (track.duration || 0), 0);

    if (playlistTotalDuration === 0) {
      // If total duration is zero (e.g., missing durations), return the first track
      return NextResponse.json<CurrentTrackResponse>({
        currentTrack: tracks[0],
      });
    }

    // Use the same fixed anchor date as now-playing for consistency
    // Using January 1, 2025 00:00:00 UTC as the anchor point
    const playlistStartTime = new Date('2025-01-01T00:00:00.000Z').getTime();
    
    // Calculate how much time has elapsed since the playlist started
    const elapsedTime = serverTime - playlistStartTime;
    
    // Calculate current position in the playlist loop (in milliseconds)
    const currentGlobalTimeMs = elapsedTime % playlistTotalDuration;

    let cumulativeDuration = 0;
    let currentTrack: Track | null = null;

    for (const track of tracks) {
      const trackDuration = track.duration || 0;
      if (currentGlobalTimeMs >= cumulativeDuration && currentGlobalTimeMs < cumulativeDuration + trackDuration) {
        currentTrack = track;
        break;
      }
      cumulativeDuration += trackDuration;
    }

    // Fallback if something went wrong (should not happen if playlistTotalDuration > 0)
    if (!currentTrack && tracks.length > 0) {
      currentTrack = tracks[0];
    }
    
    return NextResponse.json<CurrentTrackResponse>({
      currentTrack,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in /api/radio/current-track:', errorMessage);
    return NextResponse.json<CurrentTrackResponse>(
      { currentTrack: null }, 
      { status: 500, statusText: 'Failed to get current track info.' }
    );
  }
}

// app/api/radio/tracks/route.ts
import { NextResponse } from 'next/server';

// The Track interface should be consistent with the one in generate-playlist.ts
export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

const R2_PUBLIC_URL_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL_BASE;
const PLAYLIST_FILENAME = 'playlist.json';

// This tells Next.js to cache the result for 300 seconds (5 minutes) and re-fetch it in the background.
export const revalidate = 300;

export async function GET() {
  if (!R2_PUBLIC_URL_BASE) {
    console.error('CRITICAL: Missing NEXT_PUBLIC_R2_PUBLIC_URL_BASE environment variable.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const playlistUrl = `${R2_PUBLIC_URL_BASE}/${PLAYLIST_FILENAME}`;

  try {
    // Use fetch to leverage Next.js's built-in data caching.
    const response = await fetch(playlistUrl, { cache: 'no-store' }); // Use 'no-store' to always fetch the latest, or rely on `revalidate`

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching playlist from R2: ${response.status} ${response.statusText}`, { errorText });
      throw new Error('Failed to fetch playlist from storage.');
    }

    const tracks: Track[] = await response.json();
    return NextResponse.json(tracks);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in /api/radio/tracks:', errorMessage);

    // Return an empty array so the frontend player doesn't crash.
    return NextResponse.json([], {
      status: 500,
      statusText: 'Failed to load track list.',
    });
  }
}

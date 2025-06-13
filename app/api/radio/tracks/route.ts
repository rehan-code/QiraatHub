// app/api/radio/tracks/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number; // Duration is harder to get dynamically without reading file headers
}

// Ensure your environment variables are set in .env.local
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE; // e.g., https://your-bucket.your-account-id.r2.cloudflarestorage.com OR your custom domain

// Basic check for environment variables
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE) {
  console.error('CRITICAL: Missing one or more R2 environment variables. API will not function correctly.');
  // Consider how to handle this in production - perhaps a health check endpoint would fail.
}

const s3Client = new S3Client({
  region: 'auto', // Required for R2
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || 'dummy_access_key', // Provide dummy if not set to avoid crash, but log error
    secretAccessKey: R2_SECRET_ACCESS_KEY || 'dummy_secret_key', // Provide dummy if not set
  },
});

// Helper function to derive metadata from filename (customize as needed)
// Example: "Artist Name - Track Title.mp3" -> { artist: "Artist Name", title: "Track Title" }
// Example: "Track Title Only.mp3" -> { title: "Track Title Only" }
function extractMetadataFromFilename(filenameWithKey: string): { title: string; artist?: string } {
  // Get just the filename from the key (in case it includes folder paths)
  const filename = filenameWithKey.split('/').pop() || filenameWithKey;
  
  // Remove .mp3 extension
  let name = filename.replace(/\.mp3$/i, '');
  
  const parts = name.split(' - ');
  if (parts.length >= 2) { // Allows for "Artist - Album - Title" if you want to parse further
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
  }
  return { title: name.trim() }; // Fallback if no " - " separator
}

export async function GET() {
  if (!R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
     console.error('API call to /api/radio/tracks failed due to missing R2 configuration.');
     return NextResponse.json({ error: 'Server configuration error for R2 access. Please check server logs.' }, { status: 500 });
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      // Prefix: 'your-audio-folder/', // Optional: if your mp3s are in a specific subfolder within the bucket
    });

    const { Contents } = await s3Client.send(command);

    if (!Contents) {
      return NextResponse.json([]);
    }

    const tracks: Track[] = Contents
      .filter(item => item.Key && item.Key.toLowerCase().endsWith('.mp3') && (item.Size && item.Size > 0))
      .map((item: _Object, index: number) => {
        const fileKey = item.Key!; // Full path in R2, e.g., "folder/audio.mp3"
        const metadata = extractMetadataFromFilename(fileKey);
        return {
          id: `track-${item.ETag || index}`, // ETag is a good unique ID for the object version
          title: metadata.title,
          artist: metadata.artist,
          url: `${R2_PUBLIC_URL_BASE}/${fileKey}`, // Construct the full public URL
          // duration: undefined, // Client-side can determine this
        };
      });

    return NextResponse.json(tracks);
  } catch (error: any) {
    console.error('Error fetching tracks from R2:', error);
    // Avoid leaking sensitive error details to the client
    let errorMessage = 'Failed to fetch tracks from R2.';
    if (error.name === 'CredentialsProviderError') {
        errorMessage = 'R2 authentication failed. Check server credentials.';
    } else if (error.name === 'NoSuchBucket') {
        errorMessage = 'R2 bucket not found. Check bucket name configuration.';
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}

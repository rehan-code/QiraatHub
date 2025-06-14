// app/api/radio/tracks/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand, _Object } from '@aws-sdk/client-s3';
import * as mm from 'music-metadata';
import { Readable } from 'stream';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

// Ensure your environment variables are set in .env.local
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE;

// Basic check for environment variables
if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE) {
  console.error('CRITICAL: Missing one or more R2 environment variables.');
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || 'dummy_access_key',
    secretAccessKey: R2_SECRET_ACCESS_KEY || 'dummy_secret_key',
  },
});

function extractMetadataFromFilename(filenameWithKey: string): { title: string; artist?: string } {
  const filename = filenameWithKey.split('/').pop() || filenameWithKey;
  const name = filename.replace(/\.mp3$/i, '');
  const parts = name.split(' - ');
  if (parts.length > 1) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
  } else {
    return { title: name.trim() };
  }
}

export async function GET() {
  if (!R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
    console.error('API call to /api/radio/tracks failed due to missing R2 configuration.');
    return NextResponse.json({ error: 'Server configuration error for R2 access.' }, { status: 500 });
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

    const trackPromises = Contents
      .filter(item => item.Key && item.Key.toLowerCase().endsWith('.mp3') && (item.Size && item.Size > 0))
      .map(async (item: _Object) => {
        const fileKey = item.Key!;
        const fallbackMetadata = extractMetadataFromFilename(fileKey);

        try {
          const getObjectCmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: fileKey });
          const { Body, ContentLength } = await s3Client.send(getObjectCmd);

          if (!Body) throw new Error('Empty file body from R2');

          // The Body from AWS SDK v3 is a ReadableStream, which music-metadata can handle.
          const readableStream = Body as Readable;

          const metadata = await mm.parseStream(readableStream, { mimeType: 'audio/mpeg', size: ContentLength });

          return {
            id: `track-${item.ETag || fileKey}`,
            title: metadata.common.title || fallbackMetadata.title,
            artist: metadata.common.artist || fallbackMetadata.artist,
            duration: metadata.format.duration,
            url: `${R2_PUBLIC_URL_BASE}/${fileKey}`,
          };
        } catch (parseError) {
          console.warn(`Could not parse metadata for ${fileKey}. Falling back to filename.`, parseError);
          return {
            id: `track-${item.ETag || fileKey}`,
            title: fallbackMetadata.title,
            artist: fallbackMetadata.artist,
            url: `${R2_PUBLIC_URL_BASE}/${fileKey}`,
          };
        }
      });

    const tracks = await Promise.all(trackPromises);
    return NextResponse.json(tracks);

  } catch (error: unknown) {
    console.error('Error fetching tracks from R2:', error);
    let errorMessage = 'Failed to fetch tracks from R2.';
    let errorDetails = 'An unexpected error occurred.';

    if (error instanceof Error) {
      errorDetails = error.message;
      if (error.name === 'CredentialsProviderError') {
        errorMessage = 'R2 authentication failed. Check server credentials.';
      } else if (error.name === 'NoSuchBucket') {
        errorMessage = 'R2 bucket not found. Check bucket name configuration.';
      }
    }

    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
}

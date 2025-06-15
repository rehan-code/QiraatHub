import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import * as mm from 'music-metadata';
import { Readable } from 'stream';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename_script = fileURLToPath(import.meta.url);
const __dirname_script = path.dirname(__filename_script);

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname_script, '../.env') });

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE;

const PLAYLIST_JSON_FILENAME = 'playlist.json';

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE) {
  console.error('CRITICAL: Missing one or more R2 environment variables. Script cannot run.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
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

async function generatePlaylist() {
  console.log('Starting playlist generation...');
  if (!R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE) {
    console.error('Bucket name or public URL base is missing.');
    return;
  }

  try {
    console.log(`Fetching MP3 list from bucket: ${R2_BUCKET_NAME}...`);
    const listCommand = new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME });
    const { Contents } = await s3Client.send(listCommand);

    if (!Contents || Contents.length === 0) {
      console.log('No MP3 files found in the bucket.');
      return;
    }
    console.log(`Found ${Contents.length} items. Filtering for MP3s...`);

    const mp3Items = Contents.filter(item => item.Key && item.Key.toLowerCase().endsWith('.mp3') && (item.Size && item.Size > 0));
    console.log(`Processing ${mp3Items.length} MP3 files...`);

    const trackPromises = mp3Items.map(async (item: any, index: number) => {
      const fileKey = item.Key!;
      const fallbackMetadata = extractMetadataFromFilename(fileKey);
      console.log(`[${index + 1}/${mp3Items.length}] Processing: ${fileKey}`);

      try {
        const getObjectCmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: fileKey });
        const { Body, ContentLength } = await s3Client.send(getObjectCmd);

        if (!Body) throw new Error('Empty file body from R2');
        const readableStream = Body as Readable;
        const metadata = await mm.parseStream(readableStream, { mimeType: 'audio/mpeg', size: ContentLength });
        
        console.log(`  Successfully parsed metadata for: ${fileKey}`);
        return {
          id: `track-${item.ETag || fileKey.replace(/[^a-zA-Z0-9]/g, '')}`,
          title: metadata.common.title || fallbackMetadata.title,
          artist: metadata.common.artist || fallbackMetadata.artist,
          duration: metadata.format.duration,
          url: `${R2_PUBLIC_URL_BASE}/${fileKey}`,
        };
      } catch (parseError) {
        console.warn(`  Could not parse metadata for ${fileKey}. Falling back to filename. Error: ${(parseError as Error).message}`);
        return {
          id: `track-${item.ETag || fileKey.replace(/[^a-zA-Z0-9]/g, '')}`,
          title: fallbackMetadata.title,
          artist: fallbackMetadata.artist,
          url: `${R2_PUBLIC_URL_BASE}/${fileKey}`,
        };
      }
    });

    const tracks: Track[] = await Promise.all(trackPromises);
    console.log(`Successfully processed ${tracks.length} tracks.`);

    // Write to local file (optional, good for debugging)
    const localPlaylistPath = path.resolve(__dirname_script, PLAYLIST_JSON_FILENAME);
    await fs.writeFile(localPlaylistPath, JSON.stringify(tracks, null, 2));
    console.log(`Local playlist.json saved to: ${localPlaylistPath}`);

    // Upload playlist.json to R2
    // console.log(`Uploading ${PLAYLIST_JSON_FILENAME} to R2 bucket: ${R2_BUCKET_NAME}...`);
    // const putObjectCmd = new PutObjectCommand({
    //   Bucket: R2_BUCKET_NAME,
    //   Key: PLAYLIST_JSON_FILENAME, // Save at the root of the bucket
    //   Body: JSON.stringify(tracks, null, 2),
    //   ContentType: 'application/json',
    // });
    // await s3Client.send(putObjectCmd);
    // console.log(`${PLAYLIST_JSON_FILENAME} successfully uploaded to R2.`);
    // console.log(`Playlist generation complete! Public URL for playlist: ${R2_PUBLIC_URL_BASE}/${PLAYLIST_JSON_FILENAME}`);

  } catch (error) {
    console.error('Error during playlist generation:', error);
  }
}

async function run() {
  try {
    await generatePlaylist();
    console.log('Playlist generation process completed successfully.');
  } catch (error) {
    // This catch is for errors thrown directly by generatePlaylist if not caught inside it
    console.error('Error in generatePlaylist top-level execution:', error);
    process.exitCode = 1; // Indicate an error exit
  } finally {
    if (s3Client) {
      s3Client.destroy();
      console.log('S3 client destroyed. Script should now exit.');
    }
  }
}

run();

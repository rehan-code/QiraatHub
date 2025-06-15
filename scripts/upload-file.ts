// scripts/upload-file.ts
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename_script = fileURLToPath(import.meta.url);
const __dirname_script = path.dirname(__filename_script);

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(__dirname_script, '../.env') }); // Prioritize .env for scripts if it exists
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname_script, '../.env.local'), override: true });
}

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
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

async function uploadFile(localFilePath: string, r2ObjectKey: string) {
  if (!R2_BUCKET_NAME) {
    console.error('R2_BUCKET_NAME is not defined. Cannot upload.');
    process.exitCode = 1;
    return;
  }

  try {
    // Check if local file exists
    if (!fs.existsSync(localFilePath)) {
      console.error(`Error: Local file not found at ${localFilePath}`);
      process.exitCode = 1;
      return;
    }

    const fileStream = fs.createReadStream(localFilePath);
    const fileSize = fs.statSync(localFilePath).size;

    console.log(`Uploading ${localFilePath} (${(fileSize / (1024 * 1024)).toFixed(2)} MB) to R2 bucket '${R2_BUCKET_NAME}' as '${r2ObjectKey}'...`);

    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: r2ObjectKey,
        Body: fileStream,
        // ACL: 'public-read', // Uncomment if you want the file to be publicly readable directly
      },
      tags: [], // Optional tags
      queueSize: 4, // Optional concurrency configuration
      partSize: 1024 * 1024 * 5, // Optional part size (5MB is the default minimum part size for S3/R2)
      leavePartsOnError: false, // Optional cleanup on error
    });

    // Define an interface for the progress event for clarity
    interface UploadProgressEvent {
      loaded?: number;
      total?: number;
      part?: number;
      key?: string;
    }

    parallelUploads3.on('httpUploadProgress', (progress: UploadProgressEvent) => {
      if (progress.loaded && progress.total) {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        process.stdout.write(`Progress: ${percentage}% (${(progress.loaded / (1024*1024)).toFixed(2)}MB / ${(progress.total / (1024*1024)).toFixed(2)}MB)\r`);
      }
    });

    await parallelUploads3.done();
    process.stdout.write('\n'); // New line after progress
    console.log(`Successfully uploaded ${r2ObjectKey} to R2.`);
    console.log(`Public URL (if applicable and bucket is public): ${process.env.R2_PUBLIC_URL_BASE}/${r2ObjectKey}`);

  } catch (error) {
    process.stdout.write('\n'); // New line if error occurs during progress
    console.error('Error uploading file to R2:', error);
    process.exitCode = 1;
  }
}

async function run() {
  const args = process.argv.slice(2); // Remove 'node' and script path
  if (args.length < 2) {
    console.error('Usage: pnpm exec node --loader ts-node/esm scripts/upload-file.ts <localFilePath> <r2ObjectKey>');
    console.error('Example: pnpm exec node --loader ts-node/esm scripts/upload-file.ts "./my-audio.mp3" "audio/new-tracks/my-audio.mp3"');
    process.exit(1);
  }

  const [localFilePath, r2ObjectKey] = args;
  const absoluteLocalFilePath = path.resolve(localFilePath);

  try {
    await uploadFile(absoluteLocalFilePath, r2ObjectKey);
  } catch (error) {
    console.error('Unhandled error during script execution:', error);
    process.exitCode = 1;
  } finally {
    if (s3Client) {
      s3Client.destroy();
      console.log('S3 client destroyed. Script will now exit.');
    }
  }
}

run();

// scripts/get-mp3-duration.ts
import * as mm from 'music-metadata';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES modules
const __filename_script = fileURLToPath(import.meta.url);
const __dirname_script = path.dirname(__filename_script);

async function getDuration(localFilePath: string): Promise<number | undefined> {
  try {
    if (!fs.existsSync(localFilePath)) {
      console.error(`Error: File not found at ${localFilePath}`);
      return undefined;
    }

    const metadata = await mm.parseFile(localFilePath);
    return metadata.format.duration;
  } catch (error) {
    console.error(`Error parsing MP3 file ${localFilePath}:`, error);
    return undefined;
  }
}

async function run() {
  const args = process.argv.slice(2); // Remove 'node' and script path
  if (args.length < 1) {
    console.error('Usage: pnpm exec node --loader ts-node/esm scripts/get-mp3-duration.ts <localFilePath>');
    console.error('Example: pnpm exec node --loader ts-node/esm scripts/get-mp3-duration.ts "./audio/my-track.mp3"');
    process.exit(1);
  }

  const [localFilePath] = args;
  const absoluteLocalFilePath = path.resolve(localFilePath);

  console.log(`Attempting to get duration for: ${absoluteLocalFilePath}`);

  const duration = await getDuration(absoluteLocalFilePath);

  if (duration !== undefined) {
    console.log(`Duration: ${duration} seconds`);
  } else {
    console.log('Could not determine duration.');
    process.exitCode = 1;
  }
}

run();

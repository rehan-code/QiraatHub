import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = searchParams.get('surah'); // e.g., "001-al-fatihah"
  const qiraat = searchParams.get('qiraat'); // e.g., "Hafs_An_Asim"

  if (!surah || !qiraat) {
    return NextResponse.json({ error: 'Missing surah or qiraat query parameters' }, { status: 400 });
  }

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error('R2 environment variables are not fully set.');
    return NextResponse.json({ error: 'Server configuration error for R2 access.' }, { status: 500 });
  }

  const s3Client = new S3Client({
    region: 'auto', // For R2, 'auto' is typically used or a specific region if known
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  const prefix = `${surah}/${qiraat}/`; // Path to list reciter "folders"

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: '/', // This groups common prefixes (simulating folders)
    });

    const response = await s3Client.send(command);

    // CommonPrefixes will contain the "folders" (reciter directory prefixes)
    const reciterDirectoryPrefixes = response.CommonPrefixes || [];

    const reciterAudioData = await Promise.all(
      reciterDirectoryPrefixes.map(async (cp) => {
        if (!cp.Prefix) return null;

        // Extract ReciterName from the prefix like "001 Al-Fatiha/QiraatName/ReciterName/"
        const parts = cp.Prefix.split('/').filter(part => part !== '');
        const reciterName = parts.length > 2 ? parts[2] : null;

        if (!reciterName) return null;

        // List objects within this reciter's directory to find the .mp3 file
        const listAudioFilesCommand = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: cp.Prefix, // Search within this reciter's folder
          Delimiter: '',    // We want all objects, not just sub-folders
        });

        const audioFilesResponse = await s3Client.send(listAudioFilesCommand);
        const mp3File = audioFilesResponse.Contents?.find(obj => obj.Key?.endsWith('.mp3'));
        
        if (mp3File?.Key) {
          // Extract just the filename from the full key
          const audioFilename = mp3File.Key.split('/').pop();
          if (audioFilename) {
            return { reciter: reciterName, audioFilename };
          }
        }
        return null; // Return null if no mp3 found or reciterName is missing
      })
    );

    // Filter out any null results (e.g., if a reciter folder had no .mp3)
    const validReciterAudioData = reciterAudioData.filter(data => data !== null);

    return NextResponse.json(validReciterAudioData);

  } catch (error) {
    console.error('Error listing objects from R2:', error);
    return NextResponse.json({ error: 'Failed to list reciters from R2', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

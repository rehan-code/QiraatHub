import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = searchParams.get('surah'); // e.g., "001 Al-Fatiha"

  if (!surah) {
    return NextResponse.json({ error: 'Missing surah query parameter' }, { status: 400 });
  }

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error('R2 environment variables are not fully set for list-qiraat.');
    return NextResponse.json({ error: 'Server configuration error for R2 access.' }, { status: 500 });
  }

  const s3Client = new S3Client({
    region: 'auto', // For R2, 'auto' is typically used
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  const prefix = `${surah}/`; // Path to list Qira'at "folders"

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: '/', // This groups common prefixes (simulating folders)
    });

    const response = await s3Client.send(command);

    // CommonPrefixes will contain the "folders" (Qira'at names)
    const qiraatNames = response.CommonPrefixes?.map(cp => {
      // cp.Prefix will be like "001 Al-Fatiha/QiraatName/"
      // We need to extract "QiraatName"
      const parts = cp.Prefix?.split('/').filter(part => part !== '');
      return parts && parts.length > 1 ? parts[1] : null;
    }).filter(qiraatName => qiraatName !== null) || [];

    return NextResponse.json(qiraatNames);
  } catch (error) {
    console.error('Error listing Qira\'at from R2:', error);
    return NextResponse.json({ error: 'Failed to list Qira\'at from R2', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get('url');
  const filename = searchParams.get('filename');

  if (!audioUrl) {
    return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 });
  }

  try {
    // Fetch the audio file from R2
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch audio file' }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Create response with proper headers for download
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Content-Disposition', `attachment; filename="${filename || 'audio.mp3'}"`);
    headers.set('Content-Length', audioBuffer.byteLength.toString());
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error downloading audio:', error);
    return NextResponse.json({ error: 'Failed to download audio' }, { status: 500 });
  }
}

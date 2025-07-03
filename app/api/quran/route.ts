import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qiraat = searchParams.get('qiraat');
  const font = searchParams.get('font');

  if (!qiraat) {
    return NextResponse.json({ error: 'Qiraat parameter is required' }, { status: 400 });
  }

  // Construct the filename based on the query parameters.
  const filename = `data_${qiraat}${font || ''}.json`;
  
  // Construct the full path to the file within the `app/quran/data` directory.
  const filePath = path.join(process.cwd(), 'app', 'quran', 'data', filename);

  try {
    // Read the file from the filesystem.
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Return the data as a JSON response.
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    // If the file doesn't exist or there's another error, return a 404 response.
    return NextResponse.json({ error: `Data not found for qiraat '${qiraat}' and font '${font || 'default'}'` }, { status: 404 });
  }
}

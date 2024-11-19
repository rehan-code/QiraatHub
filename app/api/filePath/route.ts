import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");
  const qiraat = searchParams.get("qiraat");

  if (!surah) {
    return NextResponse.json(
      { error: "Surah parameter is required" },
      { status: 400 }
    );
  }

  const audioDir = path.join(process.cwd(), `public/audio/${surah}/${qiraat}`);
  const reciters = await readdir(audioDir);

  // create a list of the paths for all the audio files in each reciter
  const pathList = [];
  for (let index = 0; index < reciters.length; index++) {
    const recitersDir = path.join(
      process.cwd(),
      `public/audio/${surah}/${qiraat}/${reciters[index]}`
    );
    const files = await readdir(recitersDir);
    pathList.push({
      path: `/audio/${surah}/${qiraat}/${reciters[index]}/${files[0]}`,
      reciter: reciters[index],
    });
  }

  return NextResponse.json(pathList);
}

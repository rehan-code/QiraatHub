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

  let audioDir = path.join(process.cwd(), `public/audio/${surah}/${qiraat}`);
  const reciter = await readdir(audioDir);
  audioDir = path.join(
    process.cwd(),
    `public/audio/${surah}/${qiraat}/${reciter[0]}`
  );
  const file = await readdir(audioDir);
  audioDir = path.join(
    process.cwd(),
    `public/audio/${surah}/${qiraat}/${reciter[0]}/${file[0]}`
  );
  return NextResponse.json(
    `/audio/${surah}/${qiraat}/${reciter[0]}/${file[0]}`
  );
}

import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");

  if (!surah) {
    return NextResponse.json(
      { error: "Surah parameter is required" },
      { status: 400 }
    );
  }

  const audioDir = path.join(process.cwd(), `app/audio/${surah}`);
  const surahs = await readdir(audioDir);
  return NextResponse.json(surahs);
}

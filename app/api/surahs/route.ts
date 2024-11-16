import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const audioDir = path.join(process.cwd(), "app/audio");
  const surahs = await readdir(audioDir);
  return NextResponse.json(surahs);
}

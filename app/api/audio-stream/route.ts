import { NextRequest, NextResponse } from "next/server";
import * as ftp from "basic-ftp";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");
  const qiraat = searchParams.get("qiraat");
  const reciter = searchParams.get("reciter");

  if (!surah || !qiraat || !reciter) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const client = new ftp.Client();

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
      secure: true,
      secureOptions: { rejectUnauthorized: false },
    });

    const path = `domains/qiraathub.com/public_html/all-surahs/${surah}/${qiraat}/${reciter}`;
    await client.cd(path);
    const files = await client.list();
    const filePath = `${path}/${files[0].name}`;
    // console.log(files[0]);
    // console.log(filePath);

    const { PassThrough } = require("stream");
    const passThrough = new PassThrough();
    const chunks: Buffer[] = [];

    passThrough.on("data", (chunk: Buffer) => chunks.push(chunk));

    await client.downloadTo(passThrough, files[0].name);
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename="${files[0].name}"`,
      },
    });
  } catch (err) {
    console.error("FTP Error:", err);
    return NextResponse.json(
      { error: "Failed to stream audio file" },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}

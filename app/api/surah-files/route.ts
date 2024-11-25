import { NextResponse } from "next/server";
import * as ftp from "basic-ftp";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");
  const qiraat = searchParams.get("qiraat");

  if (!surah || !qiraat) {
    return NextResponse.json(
      { error: "Surah & Qiraat parameter is required" },
      { status: 400 }
    );
  }

  const client = new ftp.Client();

  try {
    //  console.log("Environment password:", {
    //    rawPassword: process.env.FTP_PASSWORD,
    //    passwordLength: process.env.FTP_PASSWORD?.length,
    //    isDefined: typeof process.env.FTP_PASSWORD !== "undefined",
    //  });

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
      secure: true,
      secureOptions: { rejectUnauthorized: false },
    });

    const path = `domains/qiraathub.com/public_html/all-surahs/${surah}/${qiraat}`;
    // Navigate to the domains directory
    await client.cd(path);

    // Get files from the domains directory
    const reciters = await client.list();
    const files = [];

    // For each reciter directory
    for (const reciter of reciters) {
      if (!reciter.name.startsWith(".")) {
        files.push({
          reciter: reciter.name,
          audioUrl: `/api/audio-stream?surah=${surah}&qiraat=${qiraat}&reciter=${reciter.name}`,
        });
      }
    }

    return NextResponse.json(files);
  } catch (err) {
    console.error("FTP Error:", err);
    return NextResponse.json(
      { error: "Failed to connect to FTP server" },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}

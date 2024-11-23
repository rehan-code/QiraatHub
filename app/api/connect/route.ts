import { NextResponse } from "next/server";
import * as ftp from "basic-ftp";

export async function GET() {
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

    // List contents of root directory
    const files = await client.list();

    return NextResponse.json({ files });
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qiraat Hub",
  description: "learn about the 10 qiraat's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Footer from "./components/footer";

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
      <body className="">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

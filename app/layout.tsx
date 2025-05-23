import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "QiraatHub | Discover the 10 Qiraat",
  description: "Learn about the 10 distinct Qiraat (Quran recitation styles) with comprehensive resources, and educational materials",
  keywords: ["Qiraat", "Quran recitation", "Islamic studies", "Quran scholars", "10 Qiraat", "Quranic sciences"],
  authors: [{ name: "QiraatHub Team" }],
  creator: "QiraatHub",
  publisher: "QiraatHub",
  metadataBase: new URL("https://qiraathub.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QiraatHub | Discover the 10 Qiraat",
    description: "Learn about the 10 distinct Qiraat (Quran recitation styles) with comprehensive resources, and educational materials",
    url: "https://qiraathub.com",
    siteName: "QiraatHub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/a_group_of_people_are_reading_the_Quran.png",
        width: 1200,
        height: 630,
        alt: "QiraatHub - Discover the 10 Qiraat"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QiraatHub | Discover the 10 Qiraat",
    description: "Learn about the 10 distinct Qiraat (Quran recitation styles)",
    images: ["/images/a_group_of_people_are_reading_the_Quran.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  category: "education",
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

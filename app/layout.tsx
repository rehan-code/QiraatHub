import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Footer from "../components/footer";
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-poppins",
// });


export const metadata: Metadata = {
  title: "QiraatHub | Discover the 10 Qiraat",
  description: "Learn about the 10 distinct Qiraat (Quran recitation styles) with comprehensive resources, and educational materials",
  keywords: ["Qiraat", "Quran recitation", "Islamic studies", "Quran scholars", "10 Qiraat", "Quranic sciences"],
  authors: [{ name: "QiraatHub" }],
  creator: "QiraatHub",
  publisher: "QiraatHub",
  metadataBase: new URL("https://qiraathub.com"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "2TugvN9yHU7h6NcNpxjwUN34MzhCZruNCXkYLLfvM3I",
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

  appleWebApp: {
    title: "QiraatHub",
  },
  manifest: "/manifest.json",
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-XQZ9RR2NC3" />
      <body className="">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

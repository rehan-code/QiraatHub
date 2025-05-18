import ExpandingGrid from "./client-components/expanding-grid";
import BlogSection from "./client-components/blog-section";
import AcademySection from "./client-components/academy-section";
import { Metadata } from "next";
import { generateHomePageSchema } from "./lib/schema";
import Script from "next/script";

export function generateMetadata(): Metadata {
  return {
    title: "QiraatHub | Discover the 10 Qiraat",
    description: "Learn about the 10 distinct qiraat (Quran recitation styles)",
    openGraph: {
      title: "QiraatHub | Discover the 10 Qiraat",
      description: "Learn about the 10 distinct qiraat (Quran recitation styles)",
      url: "https://qiraathub.com",
      siteName: "QiraatHub",
      locale: "en_US",
      type: "website",
    },
  };
}

export default function Home() {
  return (
    <div>
      {/* Schema.org structured data */}
      <Script id="schema-home" type="application/ld+json">
        {JSON.stringify(generateHomePageSchema())}
      </Script>

      <div className="text-center max-w-2xl mx-auto pt-[5rem] px-4">
        <h1 className="text-4xl font-bold mb-6">
          Discover the <span className="relative inline-block">
            Ten Qiraat
            <div className="absolute left-0 right-0 bottom-[-5px] h-[3px] bg-yellow-400 rounded-full"></div>
          </span>
        </h1>
        <p className="text-lg text-gray-700 pt-6">
          The ten Qiraat are distinct styles of Quranic recitation, each preserving the authenticity and beauty of the Quran.
        </p>
      </div>
      <ExpandingGrid />
      <AcademySection />
      <BlogSection />
    </div>
  );
}

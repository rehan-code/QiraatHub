import { notFound } from "next/navigation";
import { HeroSection } from "../components/HeroSection";
import { StatsSection } from "../components/StatsSection";
import { EarlyLifeSection } from "../components/EarlyLifeSection";
import { DidYouKnowSection } from "../components/DidYouKnowSection";
import { TransmissionSection } from "../components/TransmissionSection";
import { ResourcesSection } from "../components/ResourcesSection";
import { VideosSection } from "../components/VideosSection";
import { scholars } from "../data/scholars";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ScholarPage({ params }: PageProps) {
  const { slug } = await params;
  const scholar = scholars.find((s) => s.slug === slug);

  if (!scholar) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <HeroSection
        name={scholar.name}
        description={scholar.description}
        image={scholar.image}
      />

      <StatsSection scholar={scholar} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <EarlyLifeSection earlyLife={scholar.earlyLife} />
            <DidYouKnowSection facts={scholar.didYouKnow} />
            <TransmissionSection transmission={scholar.transmission} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <ResourcesSection resources={scholar.resources} />
            <VideosSection videos={scholar.youtubeVideos} />
          </div>
        </div>
      </div>
    </div>
  );
}
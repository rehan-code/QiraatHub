import Image from 'next/image';

interface HeroSectionProps {
  name: string;
  description: string;
  image: string;
}

export const HeroSection = ({ name, description, image }: HeroSectionProps) => (
  <div className="relative h-[50vh] w-full overflow-hidden">
    <Image
      src={image}
      alt={name}
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-sm" />
    <div className="absolute inset-0 flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{name}</h1>
            <p className="text-lg text-gray-200 leading-relaxed font-light">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

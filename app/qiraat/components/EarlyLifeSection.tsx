interface EarlyLifeSectionProps {
  earlyLife: string;
}

export const EarlyLifeSection = ({ earlyLife }: EarlyLifeSectionProps) => {
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Early Life and Legacy
      </h2>
      <p className="text-lg text-gray-700 leading-relaxed text-justify">
        {earlyLife}
      </p>
    </section>
  );
};
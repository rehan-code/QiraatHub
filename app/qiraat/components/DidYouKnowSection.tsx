interface DidYouKnowSectionProps {
  facts: string[];
}

export const DidYouKnowSection = ({ facts }: DidYouKnowSectionProps) => {
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Did You Know?</h2>
      <div className="space-y-6">
        {facts.map((fact, index) => (
          <div key={index} className="flex items-start space-x-6 group">
            <div className="flex-shrink-0 mt-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-all duration-300">
                <span className="text-white font-bold text-lg">{index + 1}</span>
              </div>
            </div>
            <div className="flex-1 bg-blue-50/50 p-5 rounded-2xl">
              <p className="text-lg text-gray-700">{fact}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
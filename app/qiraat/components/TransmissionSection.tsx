import { Scholar } from '../types';

interface TransmissionSectionProps {
  transmission: Scholar['transmission'];
}

export const TransmissionSection = ({ transmission }: TransmissionSectionProps) => {
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Transmission</h2>
      <div className="grid gap-6">
        {transmission.map((transmitter, index) => (
          <div key={index} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
            <div className="relative p-4 bg-white rounded-xl">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">{transmitter.name}</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed pl-6">{transmitter.details}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
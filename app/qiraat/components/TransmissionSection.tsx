'use client'
import { Scholar } from '../types';
import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TransmissionSectionProps {
  transmission: Scholar['transmission'];
}

export const TransmissionSection = ({ transmission }: TransmissionSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [textHeights, setTextHeights] = useState<{[key: number]: {details: number, description: number}}>({}); 
  const detailsRefs = useRef<{[key: number]: HTMLParagraphElement | null}>({});
  const descriptionRefs = useRef<{[key: number]: HTMLParagraphElement | null}>({});
  
  useEffect(() => {
    // Calculate heights of all text elements after initial render
    const newHeights: {[key: number]: {details: number, description: number}} = {};
    
    transmission.forEach((_, index) => {
      if (detailsRefs.current[index]) {
        const detailsHeight = detailsRefs.current[index]?.scrollHeight || 0;
        const descriptionHeight = descriptionRefs.current[index]?.scrollHeight || 0;
        newHeights[index] = { details: detailsHeight, description: descriptionHeight };
      }
    });
    
    setTextHeights(newHeights);
  }, [transmission]);
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-900">Transmission</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Info className="h-5 w-5 text-blue-500" />
          <span>Hover over cards for more details</span>
        </div>
      </div>

      <div className="grid gap-6">
        {transmission.map((transmitter, index) => (
          <div 
            key={index} 
            className="group relative" 
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
            <div className="relative p-4 bg-white rounded-xl overflow-hidden transition-all duration-500 ease-in-out">
              <div className="flex items-center space-x-4 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">{transmitter.name}</h3>
              </div>
              <div className="pl-6">
                <div 
                  className="relative transition-all duration-500 ease-in-out"
                  style={{
                    height: hoveredIndex === index && transmitter.description 
                      ? `${textHeights[index]?.description || 0}px` 
                      : `${textHeights[index]?.details || 0}px`,
                  }}
                >
                  <div className="relative overflow-visible">
                    <p 
                      ref={(el) => { detailsRefs.current[index] = el; }}
                      className={`text-lg text-gray-600 leading-relaxed text-justify transition-all duration-500 ease-in-out transform-gpu origin-center ${hoveredIndex === index ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    >
                      {transmitter.details}
                    </p>
                  </div>
                  {transmitter.description && (
                    <div className="absolute top-0 left-0 right-0 pr-6 overflow-visible">
                      <p 
                        ref={(el) => { descriptionRefs.current[index] = el; }}
                        className={`text-lg text-gray-600 leading-relaxed text-justify transition-all duration-500 ease-in-out transform-gpu origin-center ${hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                      >
                        {transmitter.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
import type { Metadata } from "next";
import React from 'react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "About QiraatHub | Leading Online Quranic Education Platform",
  description: "QiraatHub offers comprehensive resources on the 10 Qira'at, combining traditional knowledge with modern accessibility to deepen global understanding of Quranic recitations.",
};


const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image
          src="https://old.qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg"
          alt="QiraatHub Hero"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            About QiraatHub
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto leading-relaxed">
            Providing authentic resources on the Quran, Islam, and the Qira&apos;at for Muslims worldwide
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Mission</h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                At QiraatHub, we are dedicated to preserving and sharing authentic resources on the Quran, 
                Islam, and the various Qira&apos;at. Our platform provides comprehensive materials for Muslims 
                worldwide to deepen their understanding of the Holy Quran and its recitations.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe in making authentic Islamic knowledge accessible to everyone, 
                combining traditional scholarship with modern technology to create 
                a valuable resource hub for seekers of knowledge.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Image
                src="https://old.qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-theme_primary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What QiraatHub Offers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authentic Resources",
                description: "Access reliable and authentic materials on the Quran, Islam, and the Qira'at",
                icon: "📚"
              },
              {
                title: "Comprehensive Collection",
                description: "Explore our extensive library of texts, audio, and visual resources",
                icon: "🔍"
              },
              {
                title: "Global Accessibility",
                description: "Access valuable Islamic knowledge from anywhere in the world",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

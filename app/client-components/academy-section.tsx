'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AcademySection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl my-16 mx-4 md:mx-8 lg:mx-12 shadow-sm">
      <div className="container mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Want to learn the Quran in a{' '}
                <span className="relative inline-block">
                  Qiraat?
                  <div className="absolute left-0 right-0 bottom-[-5px] h-[3px] bg-yellow-400 rounded-full"></div>
                </span>
              </h2>
              <p className="text-lg text-gray-700">
                Join our online academy to learn Quranic recitation in any of the 10 authentic Qiraat 
                from certified instructors with traditional ijazah chains.
              </p>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Learn in any of the 10 authentic Qiraat 
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Live online classes with flexible scheduling
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Personalized one-on-one sessions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Ijazah certification from instructors
                </li>
              </ul>
              
              <div className="pt-4">
                <Link 
                  href="https://academy.qiraathub.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-500/80 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:px-7 hover:scale-105"
                >
                  Explore Our Academy
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-2" />
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image 
                src="/images/a_group_of_people_are_reading_the_Quran.png" 
                alt="Quran Learning at QiraatHub Academy" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg max-w-xs">
                  <p className="text-sm font-medium text-gray-900">
                    "Our mission is to preserve and spread the beautiful tradition of the 10 Qiraat through authentic education."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

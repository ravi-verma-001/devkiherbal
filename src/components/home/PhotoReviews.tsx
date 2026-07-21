'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const photos = [
  '/banner/photoreview1.jpeg',
  '/banner/photoreview2.jpeg',
  '/banner/photoreview3.jpeg',
  '/banner/photoreview4.jpeg',
  '/banner/photoreview5.jpeg',
  '/banner/photoreview6.jpeg',
  '/banner/photoreview7.jpeg',
  '/banner/photoreview8.jpeg',
  '/banner/photoreview9.jpeg',
];

// Extend photos array so length is divisible by 4
const extendedPhotos = [...photos, photos[0], photos[1], photos[2]];

export default function PhotoReviews() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Group photos into chunks of 4
  const chunks = [];
  for (let i = 0; i < extendedPhotos.length; i += 4) {
    chunks.push(extendedPhotos.slice(i, i + 4));
  }

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === chunks.length - 1 ? 0 : prev + 1));
    }, 3000); // Slides every 3 seconds
    
    return () => clearInterval(timer);
  }, [chunks.length]);

  return (
    <section className="pt-12 pb-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Results
          </h2>
          <p className="text-xl text-gray-600">
            See what our community is achieving.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {chunks[activeSlide].map((photo, index) => (
              <div
                key={`${activeSlide}-${photo}-${index}`}
                className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={photo}
                  alt={`Customer review`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

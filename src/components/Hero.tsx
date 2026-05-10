'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  id: number;
  image: string;
  headline?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: '/banner/banner.jpeg',
    headline: 'Revitalize Your Daily Wellness',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
  {
    id: 2,
    image: '/banner/banner2.jpeg',
    headline: 'Sleep Deep, Wake Restored',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=sleep',
  },
  {
    id: 3,
    image: '/banner/banner3.jpeg',
    headline: 'Boost Your Natural Immunity',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=immunity',
  },
  {
    id: 4,
    image: '/banner/banner4.png',
    headline: 'Pure Energy, Powered by Nature',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=energy',
  },
  {
    id: 5,
    image: '/banner/banner5.jpeg',
    headline: 'Gut Health, Simplified',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=digestive',
  },
  {
    id: 6,
    image: '/banner/banner6.jpeg',
    headline: 'Beauty From Within',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=beauty',
  },
  {
    id: 7,
    image: '/banner/banner7.jpeg',
    headline: 'Guruji Ayurveda: Rooted in Tradition',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
];

const AUTO_PLAY_INTERVAL = 4500; // 4.5 seconds

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered]);

  const goTo = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6 lg:py-10 relative">
        <div
          className="relative sm:rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(15,118,110,0.12)] bg-[#F5F5F5]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-video sm:aspect-[11/4.84] w-full bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.headline || 'Guruji Ayurveda banner'}
                  fill
                  className="object-contain sm:object-cover"
                  priority={activeIndex === 0}
                  loading={activeIndex === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, 1100px"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/45 text-white p-2 sm:p-2.5 shadow-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/45 text-white p-2 sm:p-2.5 shadow-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Pagination dots */}
          <div className="absolute inset-x-0 bottom-4 sm:bottom-5 flex justify-center">
            <div className="flex items-center gap-2.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-6 bg-amber-300'
                      : 'w-2 bg-emerald-100/90 hover:bg-amber-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
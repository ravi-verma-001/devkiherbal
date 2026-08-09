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
    id: 0,
    image: '/banner/Slider.png',
    headline: 'Your Premium Herbal Store',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
  {
    id: 1,
    image: '/banner/Slider1.png',
    headline: 'Revitalize Your Daily Wellness',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
  {
    id: 2,
    image: '/banner/Slider2.png',
    headline: 'Gut Health, Simplified',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=digestive',
  },
  {
    id: 3,
    image: '/banner/Slider3.png',
    headline: 'Beauty From Within',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=beauty',
  },
  {
    id: 4,
    image: '/banner/Slider4.png',
    headline: 'Guruji Ayurveda: Rooted in Tradition',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
  {
    id: 5,
    image: '/banner/Slider5.png',
    headline: 'Premium Organic Energy',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop?category=energy',
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
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-white">
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
                  className="object-contain"
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

        </div>
      </div>
    </section>
  );
}
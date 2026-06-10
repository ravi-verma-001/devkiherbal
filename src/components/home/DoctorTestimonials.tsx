'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const testimonials = [
  {
    name: 'Dr. Sanjana Jain',
    title: 'General Physician',
    quote: 'A tasty combination of Vitamin C, D and E with Aloe Vera extract packed in a gummy for healthy-looking hair, nails and skin. Helping in collagen production and preventing free radical and environmental damage to the skin, hair and nails.',
    image: '/doctors/sanjana.png',
  },
  {
    name: 'Dr. Mumeet Saini',
    title: 'General Physician',
    quote: 'This product has the right combination of all the essential nutrients you need for that healthy boost to be visible on your hair, skin & nails! It is superior to similar products I have come across till now.',
    image: '/doctors/mumeet.png',
  },
  {
    name: 'Dr. Roshni Singh',
    title: 'Dermatologist',
    quote: 'Nourishing our skin, hair and nail is as important as the rest of body and this product here just does the job. It provides an all around balanced pick of all the vital nutritional requirements.',
    image: '/doctors/roshni.png',
  },
  {
    name: 'Shveta Mahajan',
    title: 'Nutritionist',
    quote: 'These amazing gummies work from inside and deliver the right nutrients to maintain a youthful glow. The vegan treats are taking care of my hair too and I have started seeing positive changes in 28 days!',
    image: '/doctors/shveta.png',
  },
];

export default function DoctorTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length - cardsToShow + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + (testimonials.length - cardsToShow + 1)) % (testimonials.length - cardsToShow + 1));
  };

  const canGoNext = currentIndex < testimonials.length - cardsToShow;
  const canGoPrev = currentIndex > 0;

  return (
    <section className="py-14 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 flex flex-col items-center"
        >
          <h2 className="text-[28px] md:text-[40px] font-black text-black mb-2 tracking-tight leading-tight">
            Testimonials & Reviews
          </h2>
          
          <Link
            href="/shop"
            className="px-6 py-1 border border-[#6B2C58] text-[#6B2C58] rounded-[24px] text-[15px] md:text-[16px] font-medium hover:bg-[#6B2C58] hover:text-white transition-colors"
          >
            Explore All
          </Link>
        </motion.div>

        <div className="relative overflow-hidden px-2">
          <motion.div
            animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex gap-6"
          >
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]`}
              >
                <div className="bg-white rounded-[24px] p-6 h-full flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="flex-grow">
                    <p className="text-[#333333] text-base leading-relaxed mb-5">
                      {t.quote}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#6B2C58]/10">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-[16px] leading-tight">{t.name}</h4>
                      <p className="text-gray-500 text-xs">{t.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={prev}
            disabled={!canGoPrev}
            className={`p-2.5 rounded-full border-2 transition-all ${
              canGoPrev 
                ? 'border-gray-200 text-gray-900 hover:border-[#6B2C58] hover:text-[#6B2C58]' 
                : 'border-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={!canGoNext}
            className={`p-2.5 rounded-full border-2 transition-all ${
              canGoNext 
                ? 'border-gray-200 text-gray-900 hover:border-[#6B2C58] hover:text-[#6B2C58]' 
                : 'border-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

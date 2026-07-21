'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Copy, Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HighlightSlide {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  couponCode: string;
  statsText: React.ReactNode;
  unitsSold: string;
  badgeText: string;
  accentRGB: string;
}

const slides: HighlightSlide[] = [
  {
    id: 'u-fit-gummies',
    name: 'U-FIT Gummies',
    slug: 'u-fit-gummies',
    description: 'Maximize your workouts and stay fit with our advanced metabolism formula',
    price: 1099,
    originalPrice: 1599,
    image: '/banner/U-F.png',
    category: 'weight-management',
    couponCode: 'WHEALTHY',
    statsText: (
      <span>
        <span className="text-pink-600 font-bold">87%</span> saw enhanced metabolism and <span className="text-pink-600 font-bold">92%</span> felt more active
      </span>
    ),
    unitsSold: '2,48,300+ units sold recently',
    badgeText: 'Clinically Proven',
    accentRGB: '172, 210, 237', // swapped to light blue
  }
];

export default function FlexFitHighlight() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, setIsCartOpen } = useCart();

  const slide = slides[activeSlide];

  // Auto-play timer
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleCopy = () => {
    if (!slide) return;
    navigator.clipboard.writeText(slide.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    if (!slide) return;
    addItem({
      _id: slide.id,
      name: slide.name,
      slug: slide.slug,
      price: slide.price,
      image: slide.image,
      category: slide.category,
    });
    setIsCartOpen(true);
  };

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setCopied(false);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setCopied(false);
  };

  if (!slide) return null;

  return (
    <section 
      className="py-16 transition-colors duration-500 relative group/section" 
      style={{ 
        backgroundColor: `rgb(${slide.accentRGB})`,
        ['--background-color' as any]: slide.accentRGB
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-20 md:opacity-0 group-hover/section:opacity-100 max-md:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-20 md:opacity-0 group-hover/section:opacity-100 max-md:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Side: Product Image & Stats */}
            <div className="relative">
              <div className="bg-white rounded-[2.5rem] shadow-xl relative overflow-hidden aspect-square flex items-center justify-center">
                {/* Badges */}
                <div className="absolute top-6 right-6 z-10 flex flex-col gap-4 items-end">
                  <div className="w-16 h-16 bg-[#2D9B63] rounded-full flex flex-col items-center justify-center text-white text-center p-2 shadow-lg border-2 border-white">
                    <Info className="h-4 w-4 mb-0.5" />
                    <span className="text-[8px] font-bold uppercase leading-none">{slide.badgeText}</span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized={true}
                  />
                </div>

                {/* Statistics Overlay */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-sm border border-slate-100 py-3 px-6 rounded-2xl text-center shadow-sm">
                  <p className="text-sm md:text-base font-semibold text-gray-800">
                    {slide.statsText}
                  </p>
                </div>
              </div>
              
              {/* Units sold text */}
              <div className="mt-6 text-center lg:text-left">
                <p className="text-gray-900 font-bold text-lg">
                  {slide.unitsSold}
                </p>
              </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                  {slide.name}
                </h2>
                <p className="text-xl text-gray-800 font-medium">
                  {slide.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 line-through text-lg">Rs. {slide.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-3xl font-black text-gray-900 leading-none">Rs. {slide.price.toLocaleString('en-IN')}</span>
                </div>
                <span className="bg-black text-white px-4 py-1.5 rounded-lg font-bold text-sm uppercase tracking-wider">
                  SALE
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-700 font-semibold">
                <p>MRP Inclusive of all taxes</p>
                <p className="flex items-center gap-1">
                  or Pay ₹{Math.round(slide.price / 4)} now. Rest in 0% interest EMIs 
                  <span className="bg-green-100 text-green-700 font-bold px-1 rounded">snapmint</span>
                </p>
                <p>UPI & Cards Accepted. Online approval in 2 minutes</p>
              </div>

              <p className="text-sm font-medium text-gray-700">
                Tax included. <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
              </p>

              {/* Coupon Box */}
              <div className="bg-white/40 border-2 border-dashed border-black/20 rounded-2xl p-6 relative">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-900 font-medium">Get it for</span>
                      <span className="text-2xl font-black text-gray-900">₹ {slide.price - 100}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      + Extra 5% discount on UPI payments
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">Use Code</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900">{slide.couponCode}</span>
                      <button
                        onClick={handleCopy}
                        className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-xs font-bold uppercase px-3"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xl tracking-widest uppercase hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-4"
              >
                SHOP NOW
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center gap-2.5 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveSlide(idx); setCopied(false); }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'bg-black w-8' : 'bg-black/25 hover:bg-black/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';

import { useCart } from '@/context/CartContext';

export default function FlexFitHighlight() {
  const [copied, setCopied] = useState(false);
  const { addItem, setIsCartOpen } = useCart();
  const couponCode = 'WHEALTHY';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    addItem({
      _id: 'u-fit-gummies',
      name: 'U-FIT Gummies',
      slug: 'u-fit-gummies',
      price: 1099,
      image: '/banner/U-FIT-whitebg.png',
      category: 'weight-management',
    });
    setIsCartOpen(true);
  };

  return (
    <section className="py-16 bg-[#FDE8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Product Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-xl relative overflow-hidden aspect-square flex items-center justify-center">
              {/* Badges */}
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-4 items-end">
                <div className="w-16 h-16 bg-[#2D9B63] rounded-full flex flex-col items-center justify-center text-white text-center p-2 shadow-lg border-2 border-white">
                  <Info className="h-4 w-4 mb-0.5" />
                  <span className="text-[8px] font-bold uppercase leading-none">Clinically Proven</span>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-full max-w-[550px] max-h-[550px]">
                <Image
                  src="/banner/U-FIT-whitebg.png"
                  alt="U-FIT Gummies"
                  fill
                  className="object-contain transition-transform duration-500 hover:scale-110 scale-105 ml-4 mix-blend-multiply"
                />
              </div>

              {/* Statistics Overlay */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-pink-50/90 backdrop-blur-sm border border-pink-100 py-3 px-6 rounded-2xl text-center shadow-sm">
                <p className="text-sm md:text-base font-semibold text-gray-800">
                  <span className="text-pink-600 font-bold">87%</span> saw enhanced metabolism and <span className="text-pink-600 font-bold">92%</span> felt more active
                </p>
              </div>
            </div>
            
            {/* Units sold text */}
            <div className="mt-6 text-center lg:text-left">
              <p className="text-gray-800 font-bold text-lg">
                2,48,300+ units sold recently
              </p>
            </div>
          </motion.div>

          {/* Right Side: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                U-FIT Gummies
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Maximize your workouts and stay fit with our advanced metabolism formula
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-lg">Rs. 1,599</span>
                <span className="text-3xl font-black text-gray-900 leading-none">Rs. 1,099</span>
              </div>
              <span className="bg-[#6B2C58] text-white px-4 py-1.5 rounded-lg font-bold text-sm uppercase tracking-wider">
                SALE
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-500 font-medium">
              <p>MRP Inclusive of all taxes</p>
              <p className="flex items-center gap-1">
                or Pay ₹275 now. Rest in 0% interest EMIs 
                <span className="bg-green-100 text-green-700 font-bold px-1 rounded">snapmint</span>
              </p>
              <p>UPI & Cards Accepted. Online approval in 2 minutes</p>
            </div>

            <p className="text-sm font-medium text-gray-600">
              Tax included. <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
            </p>

            {/* Coupon Box */}
            <div className="bg-[#EBDABB] border-2 border-dashed border-[#C4A484] rounded-2xl p-6 relative">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900 font-medium">Get it for</span>
                    <span className="text-2xl font-black text-gray-900">₹ 999</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    + Extra 5% discount on UPI payments
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Use Code</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-gray-900">{couponCode}</span>
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}

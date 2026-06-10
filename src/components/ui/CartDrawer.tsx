'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeItem, total, itemCount } = useCart();

  const amountForFreeGift = 1999;
  const currentTotal = total;
  const amountNeeded = Math.max(0, amountForFreeGift - currentTotal);
  const progressPercent = Math.min(100, (currentTotal / amountForFreeGift) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-2xl font-black">Your Wellness Cart ({itemCount})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors bg-gray-50"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Free Gift Section */}
            <div className="p-4 border-b bg-white space-y-3">
              <p className="text-center text-sm font-bold text-gray-800">
                ✨ Unlock Your FREE Gift at ₹1999 🎁
              </p>
              
              <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                />
              </div>

              <p className="text-center text-sm font-bold text-gray-700">
                {amountNeeded > 0 
                  ? `Shop for Rs. ${amountNeeded} more to get a FREE gift!` 
                  : 'Congratulations! You unlocked a FREE gift!'}
              </p>

              <button className="w-full py-3 bg-[#E94040] text-white font-bold rounded-md hover:bg-red-600 transition-colors">
                Choose Your Free Gift 🎁
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-black text-white font-bold rounded-md"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item._id}-${item.variant}`} className="flex gap-4 p-3 bg-gray-50 rounded-lg relative">
                    <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/banner/F-F.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-gray-900 pr-8 leading-tight">{item.name}</h3>
                      <div className="mt-2 font-bold text-gray-700">
                        Rs. {item.price}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item._id, item.variant)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <button className="px-6 py-2 bg-black text-white font-bold rounded-md text-sm">
                    Apply
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">Discount</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="discount" className="w-4 h-4 accent-black" />
                    <span className="text-sm font-bold text-gray-700">FLAT RS. 100 OFF ON ALL PRODUCTS!</span>
                  </label>
                </div>

                <div className="flex justify-between items-center py-2 border-t mt-4">
                  <span className="font-black text-xl">Subtotal</span>
                  <span className="font-black text-xl">Rs. {total.toLocaleString()}</span>
                </div>

                <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                  <button className="w-full py-4 bg-black text-white font-black text-xl tracking-wider rounded-md hover:bg-gray-900 transition-colors">
                    Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

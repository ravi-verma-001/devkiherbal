'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeItem, total, itemCount, discount, setDiscount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), total }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        localStorage.setItem('applied-coupon-code', couponCode.trim().toUpperCase());
      } else {
        setCouponError(data.message || 'Invalid coupon');
        localStorage.removeItem('applied-coupon-code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
      localStorage.removeItem('applied-coupon-code');
    } finally {
      setCouponLoading(false);
    }
  };

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
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="px-6 py-2 bg-black text-white font-bold rounded-md text-sm disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                {discount > 0 && <p className="text-emerald-600 text-xs font-bold">Discount applied! -Rs. {discount}</p>}

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">Discount</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={discount === 100}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDiscount(100);
                        } else {
                          setDiscount(0);
                        }
                      }}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-700">FLAT RS. 100 OFF ON ALL PRODUCTS!</span>
                  </label>
                </div>

                <div className="space-y-1.5 border-t pt-4">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">Rs. {total.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="font-medium">Discount</span>
                      <span className="font-medium">-Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-black text-xl">Total</span>
                    <span className="font-black text-xl">Rs. {Math.max(0, total - discount).toLocaleString()}</span>
                  </div>
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

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_PRODUCTS = [
  {
    name: 'U-FIT BURNER',
    badge: 'NEW LAUNCH',
    badgeColor: 'bg-[#f5a623]',
    image: '/banner/U-FIT.png',
    href: '/product/u-fit',
  },
  {
    name: 'MASS BUILDER',
    badge: 'BESTSELLER',
    badgeColor: 'bg-[#1e40af]',
    image: '/banner/MassBuilder.png',
    href: '/product/mass-builder',
  },
  {
    name: 'PURIFY DETOX',
    badge: 'BESTSELLER',
    badgeColor: 'bg-[#dc2626]',
    image: '/banner/C-5.png',
    href: '/product/purify-detox',
  },
  {
    name: 'FIT FLEX BURNER',
    badge: 'TRENDING',
    badgeColor: 'bg-[#0f766e]',
    image: '/banner/FIT-FLEX.png',
    href: '/product/fit-flex',
  },
  {
    name: 'Shilajit Gummies',
    image: '/banner/ShilajitNew.png',
    href: '/product/shilajit-gummies',
  }
];

const COMBO_PRODUCTS = [
  {
    name: 'Stress-Free Sleep Combo',
    badge: 'SAVE 30%',
    badgeColor: 'bg-green-600',
    image: '/banner/C-3.png',
    href: '/product/stress-free-sleep-combo',
  },
  {
    name: 'Beauty & Sleep Combo',
    badge: 'SAVE 25%',
    badgeColor: 'bg-green-600',
    image: '/banner/C-2.png',
    href: '/product/beauty-sleep-combo',
  },
  {
    name: 'Skin & Hair Combo',
    badge: 'SAVE 35%',
    badgeColor: 'bg-green-600',
    image: '/banner/C-1.png',
    href: '/product/skin-hair-combo',
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'combo'>('all');
  const [user, setUser] = useState<any>(null);
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`)
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const displayedProducts = activeTab === 'all' ? ALL_PRODUCTS : COMBO_PRODUCTS;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 font-sans">
      <div className="bg-black text-white py-2 text-center text-xs font-medium tracking-wide">
        Free gift on orders above Rs. 1999! 🎁
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16 md:h-[72px]">
          {/* Menu on the left */}
          <div className="flex justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-black hover:bg-slate-50 transition-colors rounded-full"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 md:h-7 md:w-7" />
            </button>
          </div>

          {/* Logo center */}
          <div className="flex justify-center flex-1">
            <Link href="/" className="relative block h-[52px] md:h-[62px] transition-transform hover:scale-105 active:scale-95 duration-300">
              <img 
                src="/banner/Logo-Devki.png" 
                alt="Wellness Logo" 
                className="h-full w-auto object-contain mx-auto"
              />
            </Link>
          </div>

          {/* Cart on the right */}
          <div className="flex justify-end gap-1 sm:gap-2 items-center">
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2 text-black hover:bg-slate-50 transition-colors rounded-full"
            >
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center border-[1.5px] border-white"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link 
                  href={user.role === 'admin' ? '/admin' : '/profile'} 
                  className="p-2 text-black hover:bg-slate-100 transition-colors rounded-full" 
                  title={user.name}
                >
                  <User className="h-6 w-6 text-emerald-600" />
                </Link>
                <button 
                  onClick={async () => {
                    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
                    window.location.reload();
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-full" 
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block p-2 text-black hover:bg-slate-50 transition-colors rounded-full">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#f5f5f5] flex flex-col h-screen overflow-hidden"
          >
            {/* Menu Header */}
            <div className="bg-white px-4 h-20 flex items-center border-b border-slate-100 shrink-0 shadow-sm z-10">
              <div className="grid grid-cols-3 w-full items-center">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-black hover:bg-slate-50 transition-colors rounded-full place-self-start"
                  aria-label="Close menu"
                >
                  <X className="h-8 w-8" />
                </button>
                <div className="flex justify-center flex-1">
                  <div className="h-16 py-0.5">
                    <img 
                      src="/banner/Logo-Devki.png" 
                      alt="Wellness Logo" 
                      className="h-full w-auto object-contain mx-auto"
                    />
                  </div>
                </div>
                <div className="w-12"></div> {/* Spacer to maintain center */}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-12">
              <div className="px-4 py-4 max-w-3xl mx-auto">
                {/* Promo Banner */}
                <Link href="/bundle" onClick={() => setIsMenuOpen(false)} className="block mb-5 rounded-xl overflow-hidden shadow-sm">
                  <img src="/banner/slidder-banner.png" alt="Build Your Wellness Bundle" className="w-full h-auto object-cover" />
                </Link>
                
                {/* Toggle Buttons */}
                <div className="flex bg-white rounded-xl p-1 mb-5 shadow-sm border border-gray-100">
                  <button 
                    className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-colors ${activeTab === 'all' ? 'bg-[#2d3282] text-white' : 'text-gray-700'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Products
                  </button>
                  <button 
                    className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'combo' ? 'bg-[#2d3282] text-white' : 'text-gray-700'}`}
                    onClick={() => setActiveTab('combo')}
                  >
                    Combo
                    <span className="bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">SAVE UPTO 40%</span>
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {displayedProducts.map((product, index) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.03 }}
                    >
                      <Link
                        href={product.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between p-4 bg-white rounded-3xl shadow-sm active:scale-95 transition-transform h-full overflow-hidden relative"
                      >
                        <div className="flex flex-col gap-1.5 max-w-[60%] z-10">
                          {product.badge && (
                            <span className={`${product.badgeColor} text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md w-fit tracking-wider uppercase`}>
                              {product.badge}
                            </span>
                          )}
                          <h3 className="text-[15px] font-black text-gray-800 leading-tight">
                            {product.name}
                          </h3>
                        </div>
                        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                          {(product as any).imageBg && (
                            <div className={`absolute right-[-15px] top-1/2 -translate-y-1/2 w-24 h-24 rounded-full ${(product as any).imageBg} opacity-80 pointer-events-none`}></div>
                          )}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="relative z-10 w-full h-full object-contain"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Additional Links */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <nav className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm">
                    <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-[15px] font-semibold py-4 px-4 flex justify-between items-center group border-b border-slate-50 hover:bg-slate-50">
                      Browse All Catalog <span className="text-slate-300 group-hover:text-black transition-colors text-xl font-light">→</span>
                    </Link>
                    <Link href="/#benefits" onClick={() => setIsMenuOpen(false)} className="text-[15px] font-semibold py-4 px-4 flex justify-between items-center group border-b border-slate-50 hover:bg-slate-50">
                      Our Benefits <span className="text-slate-300 group-hover:text-black transition-colors text-xl font-light">→</span>
                    </Link>
                    {!user ? (
                      <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[15px] font-semibold py-4 px-4 flex justify-between items-center group hover:bg-slate-50">
                        Login / Sign Up <span className="text-slate-300 group-hover:text-black transition-colors text-xl font-light">→</span>
                      </Link>
                    ) : (
                      <>
                        <Link href={user.role === 'admin' ? '/admin' : '/profile'} onClick={() => setIsMenuOpen(false)} className="text-[15px] font-semibold py-4 px-4 flex justify-between items-center group border-b border-slate-50 hover:bg-slate-50">
                          {user.role === 'admin' ? 'Admin Portal' : 'My Profile'} <span className="text-slate-300 group-hover:text-black transition-colors text-xl font-light">→</span>
                        </Link>
                        <button onClick={async () => { await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' }); window.location.reload(); }} className="w-full text-left text-[15px] font-semibold text-red-500 py-4 px-4 flex justify-between items-center group hover:bg-slate-50">
                          Logout <span className="text-slate-300 group-hover:text-red-500 transition-colors text-xl font-light">→</span>
                        </button>
                      </>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


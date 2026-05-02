'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Send, Mail, User } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 space-y-8">
            {/* Boxed Logo */}
            <div className="inline-block border-2 border-white p-2">
              <h3 className="text-xl font-black leading-none tracking-tighter uppercase">
                Devki<br />Herbal
              </h3>
            </div>

            {/* Made In India Badge */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col w-12 h-7 border border-white/20">
                <div className="bg-[#FF9933] h-1/3"></div>
                <div className="bg-white h-1/3 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#000080]"></div>
                </div>
                <div className="bg-[#138808] h-1/3"></div>
              </div>
              <p className="text-sm font-bold tracking-tight">
                We are Proudly Made In India.
              </p>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white text-gray-900 h-12 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B2C58] transition-all font-medium"
                />
              </div>
              <button className="bg-[#6B2C58] hover:bg-[#5a244a] text-white px-8 h-12 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6">
              <Link href="#" className="hover:scale-110 transition-transform text-white/90 hover:text-white">
                <Facebook className="h-6 w-6 fill-white" />
              </Link>
              <Link href="#" className="hover:scale-110 transition-transform text-white/90 hover:text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                </svg>
              </Link>
              <Link href="#" className="hover:scale-110 transition-transform text-white/90 hover:text-white">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:scale-110 transition-transform text-white/90 hover:text-white">
                <Youtube className="h-6 w-6 fill-white" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <ul className="space-y-4 text-lg font-bold">
                <li><Link href="/contact" className="hover:text-gray-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/track" className="hover:text-gray-400 transition-colors">Track Order</Link></li>
                <li><Link href="/about" className="hover:text-gray-400 transition-colors">About Us</Link></li>
                <li><Link href="/shipping" className="hover:text-gray-400 transition-colors">Shipping & Delivery</Link></li>
                <li><Link href="/terms" className="hover:text-gray-400 transition-colors">Term of Use</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <ul className="space-y-4 text-lg font-bold">
                <li><Link href="/refund" className="hover:text-gray-400 transition-colors">Refund Policy</Link></li>
                <li><Link href="/shop" className="hover:text-gray-400 transition-colors">Health Supplement</Link></li>
                <li><Link href="/shop" className="hover:text-gray-400 transition-colors">Beauty Supplement</Link></li>
                <li><Link href="/shop" className="hover:text-gray-400 transition-colors">Marine Collagen Powder</Link></li>
                <li><Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold">
          <p className="text-gray-400">
            © 2026, Devki Herbal Powered by Divinecodes.info
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
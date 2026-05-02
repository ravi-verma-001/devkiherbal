'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Terms of Use</h1>
          
          <div className="space-y-8 text-gray-700">
            <p className="text-sm text-gray-500 italic">Last Updated: May 2026</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using this website (devkiherbal.com), you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Product Information</h2>
              <p>The information provided on this website is for educational purposes only and is not intended as a substitute for professional medical advice. Always consult your physician before starting any supplement regimen.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
              <p>You agree to use the website only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, or obscene material.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p>All content included on this site, such as text, graphics, logos, and images, is the property of Devki Herbal and is protected by international copyright laws.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter"
          >
            About Devki Herbal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            We are dedicated to bringing the ancient wisdom of Ayurveda to the modern lifestyle. Our mission is to provide pure, effective, and natural wellness solutions for everyone.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Our Philosophy</h2>
              <p>
                At Devki Herbal, we believe that true beauty and health start from within. We source our ingredients from the heart of India, ensuring that every product we create is a testament to quality and purity.
              </p>
            </div>
            
            <div className="bg-[#FDF7FA] p-12 rounded-[40px] border border-[#6B2C58]/10">
              <h2 className="text-3xl font-black text-[#6B2C58] mb-6 text-center">Made In India, For The World</h2>
              <p className="text-center text-gray-800 font-medium">
                We are a proudly Indian brand, supporting local farmers and sustainable harvesting practices. Our manufacturing facilities follow the strictest quality standards to deliver supplements that you can trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Pure Ingredients', desc: '100% natural and ethically sourced from across India.' },
                { title: 'Scientific Formulation', desc: 'Ancient Ayurvedic recipes meets modern science.' },
                { title: 'Transparency', desc: 'We believe in being honest about what goes into your body.' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-3xl">
                  <h3 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-widest">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

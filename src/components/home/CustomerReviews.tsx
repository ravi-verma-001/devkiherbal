'use client';

import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    name: 'Jessica L.',
    rating: 5,
    text: 'The Beauty gummies have completely changed my skin routine. I wake up with a natural glow every day. Highly recommend!',
    verified: true,
  },
  {
    name: 'Michael R.',
    rating: 5,
    text: 'Immune Boost has become a staple in our household. My kids actually ask for them because they taste so good.',
    verified: true,
  },
  {
    name: 'Amanda K.',
    rating: 5,
    text: 'Finally, supplements that don\'t taste like medicine. The Energy gummies give me a smooth boost without the jitters.',
    verified: true,
  },
];

export default function CustomerReviews() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-xl text-gray-600">
            Real reviews from real customers.
          </p>
        </motion.div>

        <motion.div
          key={active}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 border border-emerald-100"
        >
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="h-6 w-6 text-amber-400 fill-amber-400"
              />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6">
            &ldquo;{reviews[active].text}&rdquo;
          </blockquote>
          <footer className="flex items-center justify-between">
            <div>
              <cite className="not-italic font-semibold text-gray-900">
                {reviews[active].name}
              </cite>
              {reviews[active].verified && (
                <span className="block text-sm text-emerald-600">Verified Buyer</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActive((a) => (a === 0 ? reviews.length - 1 : a - 1))}
                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActive((a) => (a === reviews.length - 1 ? 0 : a + 1))}
                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </footer>
        </motion.div>

        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? 'w-8 bg-emerald-600' : 'w-2 bg-emerald-200'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

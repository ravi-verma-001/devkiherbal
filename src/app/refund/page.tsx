'use client';

import { motion } from 'framer-motion';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Refund Policy</h1>
          
          <div className="space-y-8 text-gray-700 text-lg">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Exchanges</h2>
              <p>Due to the nature of health supplements, we cannot accept returns once the seal is broken. However, we are happy to offer a refund or exchange if:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You received the wrong product.</li>
                <li>The product was damaged during shipping.</li>
                <li>The product is expired or has quality issues.</li>
              </ul>
            </section>

            <section className="bg-[#FDF7FA] p-10 rounded-[32px] border border-[#6B2C58]/10">
              <h2 className="text-2xl font-bold text-[#6B2C58] mb-4">Refund Process</h2>
              <p>To request a refund, please send an email to <strong>ravivarma.official@gmail.com</strong> with your Order ID and clear photos of the issue. Once approved, the refund will be processed to your original payment method within 7-10 business days.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellations</h2>
              <p>Orders can only be cancelled within 12 hours of placement. Once an order is dispatched, it cannot be cancelled.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

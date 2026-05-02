'use client';

import { motion } from 'framer-motion';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Shipping & Delivery</h1>
          
          <div className="space-y-12 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domestic Shipping (India)</h2>
              <p>We provide fast and reliable shipping across all major cities in India. Our shipping partners include BlueDart, Delhivery, and XpressBees.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Delivery Time:</strong> 3-5 business days for Metro cities, 5-7 business days for other locations.</li>
                <li><strong>Shipping Cost:</strong> Free shipping on orders above ₹999. A flat fee of ₹99 applies to orders below this value.</li>
                <li><strong>Processing:</strong> Orders are processed and dispatched within 24-48 hours.</li>
              </ul>
            </section>

            <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking Your Order</h2>
              <p>Once your order is shipped, you will receive an SMS and Email with your tracking number. You can also track your order directly on our website using the <a href="/track" className="text-emerald-600 font-bold hover:underline">Track Order</a> page.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Lost Packages</h2>
              <p>If your package arrives damaged or is lost in transit, please contact our support team at <strong>ravivarma.official@gmail.com</strong> within 48 hours of the delivery date. We will investigate and provide a replacement as soon as possible.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

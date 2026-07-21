'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';

const placeholderImage = 'https://images.unsplash.com/photo-1550572017-edd951aa81a2?w=100&h=100&fit=crop';

function CheckoutPageContent() {
  const router = useRouter();
  const { items, total, clearCart, discount } = useCart();
  const finalTotal = Math.max(0, total - discount);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IN',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('order_id');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    if (orderIdParam) {
      const verifyPayment = async () => {
        setIsVerifying(true);
        setVerificationError('');
        try {
          const pendingOrderDataStr = localStorage.getItem('pending-order-data');
          if (!pendingOrderDataStr) {
            throw new Error('Pending order details not found. Please contact support.');
          }
          const orderData = JSON.parse(pendingOrderDataStr);

          const resVerify = await fetch('/api/cashfree/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderIdParam,
              orderData,
            }),
          });

          const verifyData = await resVerify.json();
          if (resVerify.ok && verifyData.success) {
            clearCart();
            localStorage.removeItem('pending-order-data');
            setConfirmed(true);
          } else {
            throw new Error(verifyData.message || 'Payment verification failed.');
          }
        } catch (err: any) {
          console.error(err);
          setVerificationError(err.message || 'Something went wrong during payment verification.');
        } finally {
          setIsVerifying(false);
        }
      };

      verifyPayment();
    }
  }, [orderIdParam, clearCart]);

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);

    try {
      // 1. Load Cashfree Script
      const resScript = await loadCashfreeScript();
      if (!resScript) {
        alert('Cashfree SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 2. Prepare Order Data
      const orderDetails = {
        userId: 'guest',
        items: items.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total: finalTotal,
        shippingAddress: {
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      };

      // 3. Create Cashfree Order
      const resOrder = await fetch('/api/cashfree/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
        }),
      });

      const orderData = await resOrder.json();
      if (!resOrder.ok) {
        throw new Error(orderData.details || orderData.error || 'Failed to create Cashfree order');
      }

      // 4. Save order details locally so they can be written to DB upon successful callback
      localStorage.setItem('pending-order-data', JSON.stringify(orderDetails));

      // 5. Initialize Cashfree and Redirect to Checkout
      const cashfree = (window as any).Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox',
      });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: '_self',
      });

    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
        <p className="text-gray-600 max-w-md">
          Please wait while we verify your transaction. Do not refresh or close this window.
        </p>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <span className="text-4xl text-red-600">✕</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          {verificationError}
        </p>
        <button
          onClick={() => {
            setVerificationError('');
            router.replace('/checkout');
          }}
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Try Checkout Again
        </button>
      </div>
    );
  }

  if (items.length === 0 && !confirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-emerald-600 font-medium hover:text-emerald-700">
          Shop products
        </Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for your order. You will receive an email confirmation shortly.
        </p>
        <Link
          href="/shop"
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
          {/* Address Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50">
                <div className="h-10 w-10 relative flex-shrink-0">
                  <img
                    src="https://www.cashfree.com/favicon.ico"
                    alt="Cashfree"
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-500">Fast & Secure payment via Cashfree</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Pay via UPI, Cards, Netbanking, or Wallets using Cashfree's secure checkout.
              </p>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.image || placeholderImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Place Order'}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}

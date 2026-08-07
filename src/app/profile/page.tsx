'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogOut, Package, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndOrders() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`);
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.user?.role === 'admin') {
          router.push('/admin');
          return;
        }
        setUser(data.user);

        if (data.user?.userId) {
          const ordersRes = await fetch(`${API_BASE}/api/orders?userId=${data.user.userId}`);
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setOrders(ordersData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndOrders();
  }, [router]);

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    router.push('/login');
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'My Account'}</h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>

        {/* Purchase History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[32px] p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-slate-500 mb-6">Looks like you haven't made any purchases.</p>
              <Link href="/shop" className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, i) => (
                <div key={order._id} className="border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Order Placed</p>
                      <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Total Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Order ID</p>
                      <p className="text-sm font-mono text-slate-600">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                      {getStatusIcon(order.status)}
                      <span className="font-semibold capitalize text-gray-700">{order.status}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <ul className="space-y-4">
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-emerald-600">{formatCurrency(item.price * item.quantity)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

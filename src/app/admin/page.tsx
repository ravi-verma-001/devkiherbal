'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  X,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  inStock: boolean;
  featured: boolean;
}

interface Order {
  _id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'Immunity',
    benefits: 'Immune support, Vitamin C',
    ingredients: 'Vitamin C, Zinc',
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`)
      .then(r => r.json())
      .then(data => {
        if (data.user?.role !== 'admin') {
          router.push('/login');
        } else {
          Promise.all([
            fetch(`${API_BASE}/api/products`).then((r) => r.json()),
            fetch(`${API_BASE}/api/orders`).then((r) => r.json()),
          ])
            .then(([prods, ords]) => {
              setProducts(Array.isArray(prods) ? prods : []);
              setOrders(Array.isArray(ords) ? ords : []);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-'),
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          benefits: newProduct.benefits.split(',').map((b) => b.trim()),
          ingredients: newProduct.ingredients.split(',').map((i) => i.trim()),
          images: [],
          inStock: true,
          stockQuantity: 100,
          rating: 4.5,
          reviewCount: 0,
          featured: false,
        }),
      });
      if (res.ok) {
        const prod = await res.json();
        setProducts((prev) => [prod, ...prev]);
        setShowAddProduct(false);
        setNewProduct({ name: '', slug: '', description: '', price: '', category: 'Immunity', benefits: '', ingredients: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Admin Dashboard
        </motion.h1>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="h-8 w-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                  <h2 className="text-lg font-bold">Products</h2>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-900 transition-all text-sm uppercase tracking-wide shadow-lg active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 text-left text-xs text-gray-500 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Product</th>
                        <th className="px-6 py-4 font-bold">Category</th>
                        <th className="px-6 py-4 font-bold">Price</th>
                        <th className="px-6 py-4 font-bold">Stock</th>
                        <th className="px-6 py-4 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-medium">{formatCurrency(p.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 ${p.inStock ? 'text-emerald-600' : 'text-red-500'} font-bold text-sm`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-600' : 'bg-red-500'}`} />
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 text-left text-xs text-gray-500 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold text-black border-slate-300">Order ID</th>
                        <th className="px-6 py-4 font-bold text-black border-slate-300">Customer</th>
                        <th className="px-6 py-4 font-bold text-black border-slate-300 text-center">Items</th>
                        <th className="px-6 py-4 font-bold text-black border-slate-300">Total</th>
                        <th className="px-6 py-4 font-bold text-black border-slate-300">Status</th>
                        <th className="px-6 py-4 font-bold text-black border-slate-300">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((o) => (
                        <tr 
                          key={o._id} 
                          onClick={() => setSelectedOrder(o)}
                          className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600 font-bold">#{o._id?.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{o.shippingAddress?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{o.shippingAddress?.city}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                              {o.items?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(o.total)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-400">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Analytics Overview</h2>
                    <p className="text-sm text-gray-500">Track your business performance</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200">
                    <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                    <p className="text-4xl font-black">{formatCurrency(totalRevenue)}</p>
                    <div className="mt-4 pt-4 border-t border-emerald-400/30 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
                       <span className="text-xs font-bold text-emerald-100 tracking-wide">REAL-TIME DATA</span>
                    </div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Orders</p>
                    <p className="text-4xl font-black text-gray-900">{orders.length}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       <span className="text-xs font-bold text-gray-400 tracking-wide">{orders.filter(o => o.status === 'paid').length} SUCCESSFUL PAYMENTS</span>
                    </div>
                  </div>
                </div>
                <p className="mt-8 text-sm text-gray-400 font-medium">
                  Note: Values shown here are absolute totals from your database records.
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1 block">Order Details</span>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
                      #{selectedOrder._id?.slice(-8).toUpperCase()}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Left Column: Items & Payment */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Items Ordered</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center group">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 leading-tight">{item.name}</span>
                              <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center italic">
                          <span className="text-lg font-black text-gray-900">Total Amount</span>
                          <span className="text-2xl font-black text-emerald-600">{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Info</h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between"><span className="text-gray-500">Method:</span> <span className="font-bold uppercase">{selectedOrder.paymentMethod}</span></p>
                        {selectedOrder.razorpayOrderId && (
                          <p className="flex justify-between"><span className="text-gray-500">Razorpay Order:</span> <span className="font-mono text-xs">{selectedOrder.razorpayOrderId}</span></p>
                        )}
                        {selectedOrder.razorpayPaymentId && (
                          <p className="flex justify-between"><span className="text-gray-500">Payment ID:</span> <span className="font-mono text-xs">{selectedOrder.razorpayPaymentId}</span></p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Shipping & Status */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h3>
                      <div className="p-6 rounded-3xl border border-slate-100 bg-white">
                        <p className="font-black text-lg text-gray-900 mb-2">{selectedOrder.shippingAddress.name}</p>
                        <div className="space-y-1 text-gray-600 font-medium leading-relaxed">
                          <p>{selectedOrder.shippingAddress.address}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                          <p>{selectedOrder.shippingAddress.zipCode}</p>
                          <p className="text-gray-400 uppercase text-xs font-black mt-4 tracking-widest">{selectedOrder.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Order Status</h3>
                      <div className="space-y-4">
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                          className={`w-full px-6 py-4 rounded-2xl font-black uppercase text-sm tracking-widest appearance-none border-2 transition-all cursor-pointer ${
                            getStatusColor(selectedOrder.status).replace('bg-', 'border-').replace('text-', 'text-')
                          } bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-50`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid (Confirm)</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center italic">
                          Last updated: {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Add Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    >
                      <option value="Immunity">Immunity</option>
                      <option value="Sleep">Sleep</option>
                      <option value="Energy">Energy</option>
                      <option value="Mood">Mood</option>
                      <option value="Digestive">Digestive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-gray-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-95"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

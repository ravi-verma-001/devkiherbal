import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { razorpay } from '@/lib/razorpay';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    if (!razorpay) {
      return NextResponse.json({ error: 'Configuration Error', details: 'Razorpay is not configured' }, { status: 500 });
    }

    await dbConnect();
    const user = getAuthUser(request);

    const { 
      items, 
      shippingAddress, 
      couponCode,
      currency = 'INR' 
    } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    // 1. Recalculate prices and check stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const isValidObjectId = mongoose.isValidObjectId(item.productId);
      const dbProduct = isValidObjectId 
        ? await Product.findById(item.productId)
        : await Product.findOne({ $or: [{ _id: item.productId }, { slug: item.productId }] });

      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
      }

      // Check stock
      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json({ error: `${dbProduct.name} is out of stock` }, { status: 400 });
      }

      const itemPrice = dbProduct.variantPrices?.[item.variant || '1m'] || dbProduct.price;
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        productId: dbProduct._id.toString(),
        name: dbProduct.name,
        price: itemPrice,
        quantity: item.quantity,
      });
    }

    // 2. Validate coupon if present
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
        expiresAt: { $gt: new Date() },
      });

      if (coupon) {
        const meetsMinPurchase = !coupon.minPurchase || subtotal >= coupon.minPurchase;
        const meetsMaxUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;

        if (meetsMinPurchase && meetsMaxUses) {
          discount = coupon.discountType === 'percentage'
            ? (subtotal * coupon.discountValue) / 100
            : Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    const finalTotal = Math.max(0, subtotal - discount);

    // 3. Create pending Order document first
    const order = await Order.create({
      userId: user?.userId || 'guest',
      items: validatedItems,
      total: finalTotal,
      status: 'pending',
      shippingAddress,
      paymentMethod: 'razorpay',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // TTL: 24h
    });

    const orderId = order._id.toString();

    const options = {
      amount: Math.round(finalTotal * 100), // convert to paise
      currency,
      receipt: orderId,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save razorpayOrderId to the order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: orderId,
    });
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

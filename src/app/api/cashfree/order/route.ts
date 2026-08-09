import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = getAuthUser(request);
    
    const { 
      items, 
      shippingAddress, 
      couponCode,
      currency = 'INR', 
      customerName, 
      customerEmail, 
      customerPhone 
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
      let dbProduct = null;
      try {
        const isValidObjectId = mongoose.isValidObjectId(item.productId);
        dbProduct = isValidObjectId 
          ? await Product.findById(item.productId)
          : await Product.findOne({ $or: [{ _id: item.productId }, { slug: item.productId }] });
      } catch (err) {
        // Fallback for case where Mongoose throws CastError on non-standard string IDs
        dbProduct = await Product.findOne({ $or: [{ _id: item.productId }, { slug: item.productId }] });
      }

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

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: 'Configuration Error', details: 'Cashfree API credentials are missing in server environment.' },
        { status: 500 }
      );
    }

    const appType = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
    const cashfreeHost = appType === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    // 3. Create pending Order document first to secure prices and details
    const order = await Order.create({
      userId: user?.userId || 'guest',
      items: validatedItems,
      total: finalTotal,
      status: 'pending',
      shippingAddress,
      paymentMethod: 'cashfree',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // TTL: 24h
    });

    const orderId = order._id.toString();

    let origin = request.nextUrl.origin;
    if (origin.startsWith('http://') && appType === 'production') {
      origin = origin.replace('http://', 'https://');
    }

    const response = await fetch(`${cashfreeHost}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(finalTotal.toFixed(2)),
        order_currency: currency,
        customer_details: {
          customer_id: user?.userId || `guest_${Date.now()}`,
          customer_name: customerName || shippingAddress.name || 'Guest Customer',
          customer_email: customerEmail || 'guest@example.com',
          customer_phone: customerPhone || '9999999999',
        },
        order_meta: {
          return_url: `${origin}/checkout?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Clean up the created order if payment gateway call failed
      await Order.findByIdAndDelete(orderId);
      return NextResponse.json(
        { error: data.message || 'Failed to create order on Cashfree', details: data },
        { status: 400 }
      );
    }

    // Save cashfreeOrderId to the order
    order.cashfreeOrderId = data.cf_order_id || data.order_id;
    await order.save();

    return NextResponse.json({
      order_id: orderId,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
      environment: appType,
    });
  } catch (error: any) {
    console.error('Cashfree Order Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

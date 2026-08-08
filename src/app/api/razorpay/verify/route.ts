import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature
    } = await request.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid signature' }, 
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Fetch order from DB
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Idempotency Check
    if (order.status === 'paid') {
      return NextResponse.json({ 
        message: 'Payment verified successfully (already processed)', 
        orderId: order._id 
      });
    }

    // 3. Decrement inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    // 4. Remove TTL expiry so order is permanent
    order.status = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.expiresAt = undefined;
    await order.save();

    // Send email notification to admin
    try {
      const { sendOrderNotification } = await import('@/utils/email');
      await sendOrderNotification(order);
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
    }

    return NextResponse.json({ 
      message: 'Payment verified successfully', 
      orderId: order._id 
    });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

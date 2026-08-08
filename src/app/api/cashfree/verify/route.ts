import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';


export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Fetch order from DB
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Idempotency Check: if already paid, success
    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully (already processed)',
        orderId: order._id,
      });
    }

    const appType = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
    const cashfreeHost = appType === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    const response = await fetch(`${cashfreeHost}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
        'x-api-version': '2023-08-01',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order status from Cashfree');
    }

    // 3. Verify status and amount
    if (data.order_status === 'PAID') {
      if (Math.abs(data.order_amount - order.total) > 0.01) {
        return NextResponse.json(
          { success: false, message: 'Payment amount mismatch' },
          { status: 400 }
        );
      }

      // 4. Decrement inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity },
        });
      }

      // 5. Remove TTL expiry so order is permanent
      order.status = 'paid';
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
        success: true,
        message: 'Payment verified successfully',
        orderId: order._id,
      });
    } else {
      return NextResponse.json(
        { success: false, message: `Payment not completed. Status: ${data.order_status}` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Cashfree Verification Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

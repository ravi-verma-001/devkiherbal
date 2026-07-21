import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderData } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
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

    if (data.order_status === 'PAID') {
      await dbConnect();

      // Create the order in the database
      const order = await Order.create({
        ...orderData,
        status: 'paid',
        paymentMethod: 'cashfree',
        cashfreeOrderId: orderId,
      });

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
      { error: 'Failed to verify Cashfree payment', details: error.message },
      { status: 500 }
    );
  }
}

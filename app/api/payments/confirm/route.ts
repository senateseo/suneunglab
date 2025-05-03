import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Get your secret keys from environment variables for security
const widgetSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_TOSS_PAYMENTS_WIDGET_SECRET_KEY_PROD
    : process.env.NEXT_PUBLIC_TOSS_PAYMENTS_WIDGET_SECRET_KEY_DEV;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Using service role key for server operations
);

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const encryptedWidgetSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

// Helper function to save payment data to database
async function savePaymentData(paymentData, userId = null) {
  const { payment_key, order_id, amount, status, message } = paymentData;
  
  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        payment_key,
        order_id,
        amount,
        status,
        message,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ])
    .select();
  
  if (error) {
    console.error('Error saving payment data to database:', error);
    return null;
  }
  
  return data;
}

// Next.js API route handler for confirming Toss payments
export async function POST(request: Request) {
  try {
    // Parse the request body
    const { paymentKey, orderId, amount, userId } = await request.json();
    
    // Validate required fields
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: encryptedWidgetSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        amount,
        paymentKey,
      }),
    });

    // Parse the response from Toss API
    const result = await response.json();
    
    // Handle error case
    if (!response.ok) {
      console.error("Payment confirmation failed:", result);
      
      // Save failed payment data to database
      await savePaymentData({
        payment_key: paymentKey,
        order_id: orderId,
        amount,
        status: 'FAILED',
        message: result.message || '결제 승인 실패',
      }, userId);
      
      return NextResponse.json(result, { status: response.status });
    }

    // Handle success case
    console.log("Payment confirmed successfully:", result);
    
    // Save successful payment data to database
    await savePaymentData({
      payment_key: paymentKey,
      order_id: orderId,
      amount,
      status: 'SUCCESS',
      message: '결제 승인 성공',
    }, userId);
    
    return NextResponse.json(result, { status: response.status });
    
  } catch (error) {
    console.error("Error processing payment confirmation:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 
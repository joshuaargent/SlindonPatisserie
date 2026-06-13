// ============================================
// Teya Payment Integration
// ============================================
// 
// Required environment variables:
// - NEXT_PUBLIC_TEYA_API_URL: Teya API endpoint
// - NEXT_PUBLIC_TEYA_MERCHANT_ID: Your merchant ID
// - TEYA_API_KEY: API key for server-side requests
//
// Contact Teya to obtain credentials: https://www.teya.io

export const teyaConfig = {
  apiUrl: process.env.NEXT_PUBLIC_TEYA_API_URL || 'https://api.teya.io',
  merchantId: process.env.NEXT_PUBLIC_TEYA_MERCHANT_ID || '',
  apiKey: process.env.TEYA_API_KEY || '',
};

/**
 * Create a Teya payment session (like Stripe PaymentIntent)
 * This is called when user reaches checkout confirmation
 */
export async function createTeyaPaymentSession(params: {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  description: string;
}) {
  // In production, this would call Teya's API
  // For now, returning a mock session structure
  
  const session = {
    id: `tpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    amount: params.amount * 100, // Teya uses minor units (pence)
    currency: 'GBP',
    orderId: params.orderId,
    customerEmail: params.customerEmail,
    customerName: params.customerName,
    description: params.description,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true`,
    createdAt: new Date().toISOString(),
  };
  
  // In production:
  // const response = await fetch(`${teyaConfig.apiUrl}/v1/payments/sessions`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${teyaConfig.apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     amount: params.amount * 100,
  //     currency: 'GBP',
  //     reference: params.orderId,
  //     customer: {
  //       email: params.customerEmail,
  //       name: params.customerName,
  //     },
  //     returnUrl: session.returnUrl,
  //     cancelUrl: session.cancelUrl,
  //   }),
  // });
  
  return session;
}

/**
 * Verify Teya payment status (webhook would call this)
 */
export async function verifyTeyaPayment(sessionId: string) {
  // In production, verify with Teya's API
  // Return payment status
  
  return {
    id: sessionId,
    status: 'completed', // mock
    paidAt: new Date().toISOString(),
  };
}

/**
 * Format amount for Teya (minor units)
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format amount from Teya (major units)
 */
export function fromMinorUnits(amount: number): number {
  return amount / 100;
}

/**
 * Check if Teya is configured
 */
export function isTeyaConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_TEYA_API_URL &&
    process.env.NEXT_PUBLIC_TEYA_MERCHANT_ID &&
    process.env.TEYA_API_KEY
  );
}

/**
 * Build Teya payment redirect URL
 */
export function buildTeyaPaymentUrl(sessionId: string): string {
  const baseUrl = teyaConfig.apiUrl;
  return `${baseUrl}/pay/${sessionId}`;
}
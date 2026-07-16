// ============================================
// Teya Online Payments Integration
// ============================================
// 
// Required environment variables:
// - TEYA_ID_URL: OAuth token URL (https://id.teya.com/oauth/v2/oauth-token)
// - TEYA_API_URL: API URL (https://api.teya.com)
// - TEYA_CLIENT_ID: OAuth client ID
// - TEYA_CLIENT_SECRET: OAuth client secret
// - TEYA_STORE_ID: Store ID
// - NEXT_PUBLIC_TEYA_SDK_URL: SDK script URL for embedded components
//
// Based on Teya WooCommerce plugin documentation

export const teyaConfig = {
  // OAuth endpoint
  idUrl: process.env.TEYA_ID_URL || 'https://id.teya.com/oauth/v2',
  // API endpoint
  apiUrl: process.env.TEYA_API_URL || 'https://api.teya.com',
  // SDK URL for embedded components
  sdkUrl: process.env.NEXT_PUBLIC_TEYA_SDK_URL || 'https://api.teya.com/v2/checkout/sdk',
  // OAuth credentials
  clientId: process.env.TEYA_CLIENT_ID || '',
  clientSecret: process.env.TEYA_CLIENT_SECRET || '',
  storeId: process.env.TEYA_STORE_ID || '',
};

// Cache for access token
let accessTokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth access token using client credentials
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now()) {
    return accessTokenCache.token;
  }

  if (!teyaConfig.clientId || !teyaConfig.clientSecret) {
    throw new Error('Teya OAuth credentials not configured');
  }

  const response = await fetch(`${teyaConfig.idUrl}/oauth-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: teyaConfig.clientId,
      client_secret: teyaConfig.clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Teya OAuth failed: ${error}`);
  }

  const data = await response.json();
  
  // Cache the token (subtract 60 seconds for safety margin)
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

/**
 * Create a Teya checkout session for embedded components
 * Uses v2/checkout/sessions endpoint
 */
export async function createTeyaCheckoutSession(params: {
  amount: number; // in minor units (pence/cents)
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  description: string;
}) {
  if (!teyaConfig.clientId || !teyaConfig.clientSecret || !teyaConfig.storeId) {
    throw new Error('Teya OAuth credentials not configured');
  }

  // Get OAuth access token
  const accessToken = await getAccessToken();

  // Create checkout session using v2 API
  const response = await fetch(`${teyaConfig.apiUrl}/v2/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order: {
        reference: params.orderId,
        amount: params.amount,
        currency: params.currency,
      },
      checkout: {
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${params.orderId}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true`,
      },
      customer: {
        email: params.customerEmail,
        firstName: params.customerName.split(' ')[0] || params.customerName,
        lastName: params.customerName.split(' ').slice(1).join(' ') || '',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Teya session creation failed:', error);
    throw new Error(`Teya session creation failed: ${error}`);
  }

  const data = await response.json();
  
  return {
    sessionToken: data.sessionToken || data.id,
    sessionId: data.id,
    sdkUrl: teyaConfig.sdkUrl,
    orderId: params.orderId,
    amount: params.amount,
    currency: params.currency,
  };
}

/**
 * Create a Teya payment session (legacy - for hosted checkout)
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
import { NextRequest, NextResponse } from 'next/server'
import { createTeyaCheckoutSession, teyaConfig } from '@/lib/teya'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, orderId, customerEmail, customerName, description } = body

    // Validate required fields
    if (!amount || !orderId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Teya is configured
    if (!teyaConfig.apiKey || !teyaConfig.merchantId) {
      return NextResponse.json(
        { error: 'Teya payment is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Create checkout session
    const session = await createTeyaCheckoutSession({
      amount,
      currency: currency || 'GBP',
      orderId,
      customerEmail,
      customerName,
      description: description || `Order ${orderId}`,
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Teya session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

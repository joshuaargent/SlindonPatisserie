import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

// Verify Teya webhook signature using HMAC
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false
  
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    
    // Get signature from headers (Teya typically uses X-Signature or similar)
    const signature = 
      request.headers.get('x-teya-signature') ||
      request.headers.get('teya-signature') ||
      request.headers.get('signature') ||
      ''
    
    // Verify webhook signature if secret is configured
    if (process.env.TEYA_WEBHOOK_SECRET) {
      if (!verifyWebhookSignature(payload, signature, process.env.TEYA_WEBHOOK_SECRET)) {
        console.warn('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const data = JSON.parse(payload)
    console.log('Teya webhook received:', JSON.stringify(data, null, 2))
    
    // Handle different webhook event types
    const eventType = data.eventType || data.type || data.event
    
    switch (eventType) {
      case 'PAYMENT_COMPLETED':
      case 'payment.completed':
      case 'COMPLETED':
        await handlePaymentCompleted(data)
        break
      
      case 'PAYMENT_APPROVED':
      case 'payment.approved':
      case 'APPROVED':
        await handlePaymentApproved(data)
        break
      
      case 'PAYMENT_FAILED':
      case 'payment.failed':
      case 'FAILED':
        await handlePaymentFailed(data)
        break
      
      case 'PAYMENT_CANCELLED':
      case 'payment.cancelled':
      case 'CANCELLED':
        await handlePaymentCancelled(data)
        break
      
      case 'PAYMENT_PENDING':
      case 'payment.pending':
      case 'PENDING':
        await handlePaymentPending(data)
        break
      
      default:
        console.log('Unhandled webhook event type:', eventType)
    }

    // Return 200 quickly to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCompleted(data: any) {
  // Extract order reference from various possible locations
  const orderReference = 
    data.orderReference || 
    data.order?.reference || 
    data.reference ||
    data.metadata?.orderId ||
    data.payment?.orderReference

  const paymentId = data.paymentId || data.id || data.transactionId
  const amount = data.amount || data.order?.amount
  const currency = data.currency || data.order?.currency || 'GBP'

  if (!orderReference) {
    console.error('No order reference in payment completed webhook:', data)
    return
  }

  console.log(`Processing payment completed for order: ${orderReference}`)

  // Update order payment status
  const { error } = await supabaseAdmin
    .from('Order')
    .update({
      paymentStatus: 'PAID',
      paymentMethod: 'CARD',
      paymentId: paymentId || null,
      teyaPaymentId: paymentId || null,
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .eq('orderNumber', orderReference)

  if (error) {
    console.error('Failed to update order payment status:', error)
    throw error
  }

  console.log(`Order ${orderReference} marked as PAID with payment ID: ${paymentId}`)
}

async function handlePaymentApproved(data: any) {
  // Similar to completed - mark as paid
  await handlePaymentCompleted(data)
}

async function handlePaymentFailed(data: any) {
  const orderReference = 
    data.orderReference || 
    data.order?.reference || 
    data.reference ||
    data.metadata?.orderId

  const paymentId = data.paymentId || data.id || data.transactionId
  const failureReason = 
    data.failureReason || 
    data.error?.message ||
    data.errorMessage ||
    data.declineReason

  if (!orderReference) {
    console.error('No order reference in payment failed webhook:', data)
    return
  }

  console.log(`Processing payment failed for order: ${orderReference}`)

  // Update order with failed payment info
  const { error } = await supabaseAdmin
    .from('Order')
    .update({
      paymentStatus: 'FAILED',
      paymentMethod: 'CARD',
      paymentId: paymentId || null,
      teyaPaymentId: paymentId || null,
      notes: failureReason ? `Payment failed: ${failureReason}` : null,
      updatedAt: new Date().toISOString(),
    })
    .eq('orderNumber', orderReference)

  if (error) {
    console.error('Failed to update order payment status:', error)
    throw error
  }

  console.log(`Order ${orderReference} marked as FAILED: ${failureReason}`)
}

async function handlePaymentCancelled(data: any) {
  const orderReference = 
    data.orderReference || 
    data.order?.reference || 
    data.reference ||
    data.metadata?.orderId

  if (!orderReference) {
    console.error('No order reference in payment cancelled webhook:', data)
    return
  }

  console.log(`Processing payment cancelled for order: ${orderReference}`)

  // Optionally mark order as cancelled or keep pending
  const { error } = await supabaseAdmin
    .from('Order')
    .update({
      status: 'CANCELLED',
      notes: 'Payment cancelled by customer',
      updatedAt: new Date().toISOString(),
    })
    .eq('orderNumber', orderReference)

  if (error) {
    console.error('Failed to update order status:', error)
    throw error
  }

  console.log(`Order ${orderReference} marked as CANCELLED`)
}

async function handlePaymentPending(data: any) {
  // Handle pending payments (e.g., 3DS pending)
  const orderReference = 
    data.orderReference || 
    data.order?.reference || 
    data.reference ||
    data.metadata?.orderId

  if (!orderReference) {
    console.log('No order reference in pending webhook:', data)
    return
  }

  console.log(`Processing pending payment for order: ${orderReference}`)

  // Keep as pending status
  const { error } = await supabaseAdmin
    .from('Order')
    .update({
      paymentStatus: 'PENDING',
      notes: 'Payment pending (possibly awaiting 3DS verification)',
      updatedAt: new Date().toISOString(),
    })
    .eq('orderNumber', orderReference)

  if (error) {
    console.error('Failed to update order payment status:', error)
  }
}

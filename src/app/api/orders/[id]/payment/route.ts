import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { paymentId, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Update the order with payment information
    const { data, error } = await supabaseAdmin
      .from('Order')
      .update({
        paymentStatus: status === 'COMPLETED' ? 'PAID' : 'PENDING',
        paymentMethod: 'CARD',
        paymentId: paymentId || null,
        teyaPaymentId: paymentId || null,
        paidAt: status === 'COMPLETED' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Payment update error:', error)
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
  }
}

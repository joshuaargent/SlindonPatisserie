import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

function generateOrderNumber(sequence: number): string {
  return 'ORD-' + String(sequence).padStart(6, '0')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerName, customerEmail, customerPhone, deliveryMethod, pickupDate, pickupTime, deliveryAddress, notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }
    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    if (!pickupDate || !pickupTime) {
      return NextResponse.json({ error: 'Pickup date and time are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get auth user (optional - guest checkout allowed)
    let userId: string | null = null
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: userRecord } = await supabaseAdmin
        .from('User')
        .select('id')
        .eq('authId', user.id)
        .maybeSingle()
      userId = userRecord?.id ?? null
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)
    const deliveryFee = deliveryMethod === 'delivery' ? 3.50 : 0
    const total = subtotal + deliveryFee

    // Get next sequence number
    const { data: seqData } = await supabaseAdmin
      .from('Order')
      .select('orderNumber')
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle()

    const nextSeq = seqData
      ? parseInt(seqData.orderNumber.replace('ORD-', ''), 10) + 1
      : 1
    const orderNumber = generateOrderNumber(nextSeq)

    // Create the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('Order')
      .insert({
        orderNumber,
        userId,
        subtotal,
        deliveryFee,
        total,
        deliveryMethod: deliveryMethod.toUpperCase(),
        deliveryAddress: deliveryAddress || null,
        pickupDate: new Date(pickupDate + 'T' + pickupTime + ':00').toISOString(),
        pickupTime,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
      orderId: order.id,
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('OrderItem')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Rollback order
      await supabaseAdmin.from('Order').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: orderNumber,
      internalId: order.id,
      total,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper admin auth check
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('Order')
      .select(`
        *,
        User:userId (id, name, email, phone),
        OrderItem (
          quantity,
          unitPrice,
          Product:productId (name)
        )
      `)
      .orderBy('createdAt', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status.toUpperCase())
    }

    const { data: orders, error } = await query

    if (error) throw error

    // Transform to match frontend expectations
    const transformedOrders = orders?.map(order => ({
      id: order.orderNumber,
      internalId: order.id,
      customer: {
        id: (order.User as any)?.id,
        name: (order.User as any)?.name,
        email: (order.User as any)?.email,
        phone: (order.User as any)?.phone,
      },
      items: (order.OrderItem || []).map((item: any) => ({
        name: item.Product?.name || 'Unknown Product',
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      deliveryMethod: (order.deliveryMethod || '').toLowerCase(),
      deliveryAddress: order.deliveryAddress,
      pickupDate: order.pickupDate?.split('T')[0],
      pickupTime: order.pickupTime,
      status: (order.status || '').toLowerCase(),
      paymentStatus: (order.paymentStatus || '').toLowerCase(),
      createdAt: order.createdAt,
    })) || []

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders - Update order status
export async function PATCH(request: NextRequest) {
  try {
    // TODO: Add proper admin auth check
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, status, note } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    // Find order by orderNumber (display ID) or internal ID
    let query = supabaseAdmin
      .from('Order')
      .select('id, orderNumber')
      .or(`orderNumber.eq.${orderId},id.eq.${orderId}`)
      .limit(1)

    const { data: order, error: findError } = await query

    if (findError || !order || order.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const foundOrder = order[0]

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('Order')
      .update({ status: status.toUpperCase() })
      .eq('id', foundOrder.id)
      .select('id, orderNumber, status')
      .single()

    if (updateError) throw updateError

    // Add to status history
    await supabaseAdmin
      .from('OrderStatusHistory')
      .insert({
        orderId: foundOrder.id,
        status: status.toUpperCase(),
        note: note || null,
      })

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder?.orderNumber,
        status: (updatedOrder?.status || '').toLowerCase(),
      },
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
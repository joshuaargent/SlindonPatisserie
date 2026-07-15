import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's User record by authId (linking to Supabase Auth)
  const { data: userRecord } = await supabase
    .from('User')
    .select('id')
    .eq('authId', user.id)
    .maybeSingle()

  if (!userRecord) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Fetch orders for this user (by userId or by customerEmail)
  const { data: orders, error: ordersError } = await supabase
    .from('Order')
    .select(`
      id,
      "orderNumber",
      total,
      status,
      "paymentStatus",
      "paymentMethod",
      "deliveryMethod",
      "deliveryAddress",
      "pickupDate",
      "pickupTime",
      "customerName",
      "customerEmail",
      notes,
      "createdAt",
      items:OrderItem(
        id,
        quantity,
        "unitPrice",
        product:Product(id, name, "imageKey")
      )
    `)
    .or(`userId.eq.${userRecord.id},"customerEmail".eq.${user.email}`)
    .order('"createdAt"', { ascending: false })
    .limit(50)

  if (ordersError) {
    console.error('Orders fetch error:', ordersError)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return NextResponse.json({ orders: orders ?? [] })
}

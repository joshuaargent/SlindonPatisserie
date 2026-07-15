import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getEarliestPickupDate, getEarliestTimeSlot, formatLeadTime } from '@/lib/utils'

interface CartItem {
  productId: string
  quantity: number
}

// GET /api/availability - Check if cart items are available for pickup
// All products are always available (no stock tracking)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemsParam = searchParams.get('items')

    if (!itemsParam) {
      return NextResponse.json(
        { error: 'Items parameter is required' },
        { status: 400 }
      )
    }

    let items: CartItem[]
    try {
      items = JSON.parse(itemsParam)
    } catch {
      return NextResponse.json(
        { error: 'Invalid items format' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      )
    }

    // Get product IDs
    const productIds = items.map(item => item.productId)

    // Fetch available products
    const { data: products, error } = await supabaseAdmin
      .from('Product')
      .select('id, name, leadTimeDays, available')
      .in('id', productIds)
      .eq('available', true)

    if (error) throw error

    const productMap = new Map(products?.map(p => [p.id, p]) || [])
    const now = new Date()
    let maxLeadTime = 0

    const results = items.map(item => {
      const product = productMap.get(item.productId)

      if (!product) {
        return {
          productId: item.productId,
          name: 'Unknown Product',
          available: false,
          leadTimeDays: 1,
          leadTimeDisplay: '1 day',
        }
      }

      maxLeadTime = Math.max(maxLeadTime, product.leadTimeDays)

      return {
        productId: product.id,
        name: product.name,
        available: true,
        leadTimeDays: product.leadTimeDays,
        leadTimeDisplay: formatLeadTime(product.leadTimeDays),
      }
    })

    // Calculate earliest pickup
    const earliestDate = getEarliestPickupDate(maxLeadTime, true)
    const earliestTime = getEarliestTimeSlot(now)

    // Get available slots
    const availableSlots = getAvailableSlots(earliestDate, now)

    return NextResponse.json({
      canFulfillToday: true,
      leadTimeDays: maxLeadTime,
      leadTimeDisplay: formatLeadTime(maxLeadTime),
      earliestPickupDate: earliestDate.toISOString().split('T')[0],
      earliestPickupTime: earliestTime,
      availableSlots,
      products: results,
      businessHours: {
        open: '09:00',
        close: '17:00',
        days: 'Monday - Saturday',
      },
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}

function getAvailableSlots(date: Date, now: Date): string[] {
  const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  const dateStr = date.toISOString().split('T')[0]
  const todayStr = now.toISOString().split('T')[0]

  if (dateStr === todayStr) {
    const currentHour = now.getHours()
    return allSlots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0], 10)
      return slotHour > currentHour
    })
  }

  return allSlots
}

// POST /api/availability - Check a single product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .select('id, name, leadTimeDays, available')
      .eq('id', productId)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const earliestDate = getEarliestPickupDate(product.leadTimeDays, true)
    const earliestTime = getEarliestTimeSlot(new Date())

    return NextResponse.json({
      productId: product.id,
      name: product.name,
      available: product.available,
      leadTimeDays: product.leadTimeDays,
      leadTimeDisplay: formatLeadTime(product.leadTimeDays),
      canFulfillToday: true,
      earliestPickupDate: earliestDate.toISOString().split('T')[0],
      earliestPickupTime: earliestTime,
      message: product.available
        ? 'Available for pickup!'
        : 'This product is currently unavailable.',
    })
  } catch (error) {
    console.error('Error checking product availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
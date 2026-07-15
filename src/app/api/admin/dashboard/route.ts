import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Run queries in parallel
    const [
      productsResult,
      ordersResult,
      usersResult,
      reviewsResult,
      recentOrdersResult,
    ] = await Promise.all([
      // Total products
      supabaseAdmin
        .from('Product')
        .select('id', { count: 'exact', head: true }),
      // All orders
      supabaseAdmin
        .from('Order')
        .select('id, status, total, "createdAt"', { count: 'exact' }),
      // Total users
      supabaseAdmin
        .from('User')
        .select('id', { count: 'exact', head: true })
        .eq('isActive', true),
      // Pending reviews
      supabaseAdmin
        .from('Review')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'PENDING'),
      // Recent orders (last 10)
      supabaseAdmin
        .from('Order')
        .select(
          `id, "orderNumber", total, status, "createdAt",
           User:userId (name, email)`
        )
        .order('"createdAt"', { ascending: false })
        .limit(10),
    ])

    const totalProducts = productsResult.count ?? 0
    const allOrders = ordersResult.data ?? []
    const totalUsers = usersResult.count ?? 0
    const pendingReviews = reviewsResult.count ?? 0

    // Count pending orders
    const pendingOrders = allOrders.filter(
      (o) => o.status === 'PENDING' || o.status === 'CONFIRMED'
    ).length

    // Monthly revenue
    const monthlyOrders = allOrders.filter(
      (o) => o.status !== 'CANCELLED' && o['createdAt'] >= startOfMonth
    )
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0)

    // Format recent orders
    const recentOrders = (recentOrdersResult.data ?? []).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: (order.User as any)?.name ?? 'Unknown',
      email: (order.User as any)?.email ?? '',
      total: order.total,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt,
    }))

    return NextResponse.json({
      stats: {
        totalProducts,
        pendingOrders,
        totalUsers,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        pendingReviews,
      },
      recentOrders,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

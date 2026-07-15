'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  Loader2,
  Star,
  AlertCircle,
} from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  pendingOrders: number
  totalUsers: number
  monthlyRevenue: number
  pendingReviews: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customer: string
  email: string
  total: number
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Dashboard error (${res.status})`)
        }
        const data = await res.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
      } catch (err) {
        console.error('Dashboard fetch failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-8 -m-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#8B1E22] animate-spin" />
          <p className="text-[#6B5344]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-8 -m-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-600">{error ?? 'Failed to load dashboard'}</p>
          <button onClick={() => window.location.reload()} className="text-[#8B1E22] underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  const statsCards = [
    { name: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-[#8B1E22]/10' },
    { name: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingCart, color: 'bg-yellow-100' },
    { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100' },
    {
      name: 'Revenue (Month)',
      value: `£${stats.monthlyRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-green-100',
    },
  ]

  return (
    <div className="p-8 -m-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Dashboard</h1>
        <p className="text-[#6B5344] mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-[#8B1E22]" />
              </div>
              <h3 className="text-2xl font-bold text-[#3A2C2A]">{stat.value}</h3>
              <p className="text-[#6B5344] text-sm">{stat.name}</p>
            </div>
          )
        })}
      </div>

      {(stats.pendingReviews > 0 || stats.pendingOrders > 0) && (
        <div className="mb-8 space-y-3">
          {stats.pendingReviews > 0 && (
            <Link href="/admin/reviews" className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
              <Star className="w-5 h-5 text-yellow-600 shrink-0" />
              <span className="text-yellow-800 text-sm font-medium">
                {stats.pendingReviews} review{stats.pendingReviews > 1 ? 's' : ''} awaiting moderation
              </span>
              <ArrowRight className="w-4 h-4 text-yellow-600 ml-auto" />
            </Link>
          )}
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders" className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-blue-800 text-sm font-medium">
                {stats.pendingOrders} order{stats.pendingOrders > 1 ? 's' : ''} need{stats.pendingOrders === 1 ? 's' : ''} attention
              </span>
              <ArrowRight className="w-4 h-4 text-blue-600 ml-auto" />
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/products" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#8B1E22] flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#3A2C2A]">Manage Products</h3>
            <p className="text-sm text-[#6B5344]">Add, edit or remove products</p>
          </div>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#8B1E22] flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#3A2C2A]">View Orders</h3>
            <p className="text-sm text-[#6B5344]">Manage pending orders</p>
          </div>
        </Link>
        <Link href="/admin/categories" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#D0A246] flex items-center justify-center">
            <span className="text-2xl">🏷️</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#3A2C2A]">Manage Categories</h3>
            <p className="text-sm text-[#6B5344]">Organize product categories</p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#3A2C2A]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[#8B1E22] font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-[#E8DDD0] mb-4" />
            <p className="text-[#6B5344]">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F2E9]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F2E9]/50">
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium text-[#3A2C2A]">{order.orderNumber}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-[#3A2C2A]">{order.customer}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium text-[#3A2C2A]">£{order.total.toFixed(2)}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#6B5344]">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatTimeAgo(order.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/orders?id=${order.id}`} className="text-[#8B1E22] font-medium hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

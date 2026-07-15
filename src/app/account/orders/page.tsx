'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Package, ShoppingBag, Clock, MapPin, CreditCard,
  ChevronRight, ShoppingCart, Loader2, AlertCircle
} from 'lucide-react'
import { useSupabaseUser } from '@/components/providers/SupabaseProvider'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  product: { id: string; name: string; imageKey: string | null } | null
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string | null
  deliveryMethod: string
  deliveryAddress: string | null
  pickupDate: string
  pickupTime: string
  customerName: string | null
  notes: string | null
  createdAt: string
  items: OrderItem[] | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'Preparing', color: 'bg-purple-100 text-purple-800' },
  READY: { label: 'Ready for Pickup', color: 'bg-green-100 text-green-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function formatPrice(pence: number) {
  return '£' + (pence / 100).toFixed(2)
}

export default function AccountOrdersPage() {
  const { user, loading: authLoading } = useSupabaseUser()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    async function fetchOrders() {
      try {
        const res = await fetch('/api/account/orders')
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || 'Failed to load orders')
        }
        const data = await res.json()
        setOrders(data.orders)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B1E22] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <header className="bg-[#8B1E22] text-white">
        <div className="container py-6">
          <Link href="/account" className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-serif font-bold">My Orders</h1>
        </div>
      </header>

      <div className="container py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <ShoppingBag className="w-16 h-16 text-[#6B5344] mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-[#3A2C2A] mb-2">No Orders Yet</h2>
            <p className="text-[#6B5344] mb-6">When you place an order, it will appear here.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#8B1E22] text-white px-6 py-3 rounded-lg hover:bg-[#7a1a1e] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-800' }
              const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#F7F2E9] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-[#8B1E22]" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-[#6B5344]">{order.orderNumber}</p>
                        <p className="font-semibold text-[#3A2C2A]">{formatDate(order.createdAt)}</p>
                        <p className="text-sm text-[#6B5344]">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="font-bold text-[#3A2C2A]">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Delivery / Pickup */}
                    <div className="flex items-start gap-2">
                      {order.deliveryMethod === 'delivery' ? (
                        <><MapPin className="w-4 h-4 text-[#6B5344] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[#6B5344]">Delivery</p>
                          <p className="text-[#3A2C2A]">{order.deliveryAddress ?? '—'}</p>
                          <p className="text-[#6B5344]">{order.pickupDate ? formatDate(order.pickupDate) : ''} {order.pickupTime}</p>
                        </div></>
                      ) : (
                        <><MapPin className="w-4 h-4 text-[#6B5344] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[#6B5344]">Collection</p>
                          <p className="text-[#3A2C2A]">{order.pickupDate ? formatDate(order.pickupDate) : ''} {order.pickupTime}</p>
                        </div></>
                      )}
                    </div>

                    {/* Payment */}
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-[#6B5344] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#6B5344]">Payment</p>
                        <p className="text-[#3A2C2A] capitalize">
                          {order.paymentMethod?.replace('_', ' ') ?? 'Not confirmed'}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-[#6B5344] mb-1">Items</p>
                      <div className="space-y-1">
                        {(order.items ?? []).slice(0, 3).map((item) => (
                          <p key={item.id} className="text-[#3A2C2A]">
                            {item.quantity}× {item.product?.name ?? 'Product'}
                          </p>
                        ))}
                        {itemCount > 3 && (
                          <p className="text-[#6B5344] text-xs">+{itemCount - 3} more items</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

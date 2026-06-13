'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Eye, 
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  internalId: string
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryMethod: string
  deliveryAddress?: string
  pickupDate: string
  pickupTime: string
  status: string
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: Package },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (search) params.set('search', search)
      
      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }, [filterStatus, search])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Filter orders (client-side for search feedback)
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  // Update order status
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      
      if (response.ok) {
        fetchOrders()
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Orders</h1>
        <p className="text-[#6B5344] mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5344]" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 mx-auto text-[#8B1E22] animate-spin mb-4" />
            <p className="text-[#6B5344]">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-[#6B5344] mb-4" />
            <p className="text-[#6B5344] text-lg">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F2E9]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock
                  return (
                    <tr key={order.id} className="hover:bg-[#F7F2E9]/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-[#3A2C2A]">{order.id}</span>
                        <p className="text-xs text-[#6B5344] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#3A2C2A]">{order.customer.name}</p>
                        <p className="text-sm text-[#6B5344]">{order.customer.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#6B5344]">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-[#3A2C2A]">£{order.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#3A2C2A]">
                          {new Date(order.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-[#6B5344]">{order.pickupTime}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${statusConfig[order.status]?.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-[#8B1E22] font-medium hover:underline"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Count */}
      <div className="mt-4 text-sm text-[#6B5344]">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#3A2C2A]">Order {selectedOrder.id}</h2>
                <p className="text-sm text-[#6B5344]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-[#6B5344] hover:text-[#3A2C2A] text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-[#6B5344] mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => {
                        updateStatus(selectedOrder.id, key)
                        setSelectedOrder({ ...selectedOrder, status: key })
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedOrder.status === key
                          ? config.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-[#6B5344] mb-2">Customer</h3>
                <div className="bg-[#F7F2E9] rounded-lg p-4">
                  <p className="font-medium text-[#3A2C2A]">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-[#6B5344]">{selectedOrder.customer.email}</p>
                  <p className="text-sm text-[#6B5344]">{selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Pickup Info */}
              <div>
                <h3 className="text-sm font-medium text-[#6B5344] mb-2">Pickup Details</h3>
                <div className="bg-[#F7F2E9] rounded-lg p-4">
                  <p className="text-[#3A2C2A]">
                    <span className="font-medium">Date:</span> {new Date(selectedOrder.pickupDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-[#3A2C2A]">
                    <span className="font-medium">Time:</span> {selectedOrder.pickupTime}
                  </p>
                  <p className="text-[#3A2C2A]">
                    <span className="font-medium">Method:</span> {selectedOrder.deliveryMethod === 'delivery' ? 'Delivery' : 'Collection'}
                  </p>
                  {selectedOrder.deliveryAddress && (
                    <p className="text-[#3A2C2A]">
                      <span className="font-medium">Address:</span> {selectedOrder.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-[#6B5344] mb-2">Items</h3>
                <div className="border border-[#E8DDD0] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#F7F2E9]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#6B5344]">Item</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-[#6B5344]">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#6B5344]">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#6B5344]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DDD0]">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-[#3A2C2A]">{item.name}</td>
                          <td className="px-4 py-2 text-center text-[#6B5344]">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-[#6B5344]">£{item.price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right text-[#3A2C2A] font-medium">£{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#F7F2E9]">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium text-[#3A2C2A]">Subtotal</td>
                        <td className="px-4 py-2 text-right text-[#3A2C2A]">£{selectedOrder.subtotal.toFixed(2)}</td>
                      </tr>
                      {selectedOrder.deliveryFee > 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right text-[#6B5344]">Delivery</td>
                          <td className="px-4 py-2 text-right text-[#6B5344]">£{selectedOrder.deliveryFee.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-bold text-[#3A2C2A]">Total</td>
                        <td className="px-4 py-2 text-right font-bold text-[#8B1E22]">£{selectedOrder.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#E8DDD0] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-[#E8DDD0] rounded-lg text-[#6B5344] hover:bg-[#F7F2E9] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
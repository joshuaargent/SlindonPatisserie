'use client'

import { useState } from 'react'
import { 
  Search, 
  Eye, 
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react'

// Sample orders - in production these come from database
const sampleOrders = [
  {
    id: 'ORD-001',
    customer: { name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '07700 123456' },
    items: [
      { name: 'Butter Croissant', quantity: 2, price: 2.50 },
      { name: 'Pain au Chocolat', quantity: 1, price: 2.80 },
    ],
    subtotal: 7.80,
    deliveryFee: 0,
    total: 7.80,
    deliveryMethod: 'collection',
    pickupDate: '2026-06-12',
    pickupTime: '10:00',
    status: 'pending',
    createdAt: '2026-06-10T09:30:00Z',
  },
  {
    id: 'ORD-002',
    customer: { name: 'James Wilson', email: 'james@example.com', phone: '07700 654321' },
    items: [
      { name: 'Sourdough Boule', quantity: 2, price: 4.50 },
      { name: 'French Baguette', quantity: 3, price: 2.20 },
      { name: 'Butter Croissant', quantity: 5, price: 2.50 },
    ],
    subtotal: 24.80,
    deliveryFee: 0,
    total: 24.80,
    deliveryMethod: 'collection',
    pickupDate: '2026-06-12',
    pickupTime: '11:00',
    status: 'confirmed',
    createdAt: '2026-06-10T10:15:00Z',
  },
  {
    id: 'ORD-003',
    customer: { name: 'Emma Thompson', email: 'emma@example.com', phone: '07700 987654' },
    items: [
      { name: 'Mini Sandwich Selection', quantity: 1, price: 15.00 },
      { name: 'Cream Tea for Two', quantity: 2, price: 12.00 },
    ],
    subtotal: 39.00,
    deliveryFee: 0,
    total: 39.00,
    deliveryMethod: 'collection',
    pickupDate: '2026-06-13',
    pickupTime: '14:00',
    status: 'preparing',
    createdAt: '2026-06-09T16:00:00Z',
  },
  {
    id: 'ORD-004',
    customer: { name: 'Robert Brown', email: 'robert@example.com', phone: '07700 111222' },
    items: [
      { name: 'Croissant Box (30)', quantity: 2, price: 45.00 },
      { name: 'Baguette Box (20)', quantity: 1, price: 32.00 },
    ],
    subtotal: 122.00,
    deliveryFee: 0,
    total: 122.00,
    deliveryMethod: 'delivery',
    deliveryAddress: '45 High Street, Camberley, GU15 3RB',
    pickupDate: '2026-06-14',
    pickupTime: '09:00',
    status: 'ready',
    createdAt: '2026-06-08T11:00:00Z',
  },
  {
    id: 'ORD-005',
    customer: { name: 'Lisa Anderson', email: 'lisa@example.com', phone: '07700 333444' },
    items: [
      { name: 'Almond Croissant', quantity: 4, price: 3.20 },
      { name: 'Pain aux Raisins', quantity: 4, price: 2.70 },
    ],
    subtotal: 23.60,
    deliveryFee: 0,
    total: 23.60,
    deliveryMethod: 'collection',
    pickupDate: '2026-06-12',
    pickupTime: '15:00',
    status: 'completed',
    createdAt: '2026-06-07T14:30:00Z',
  },
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: Package },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(sampleOrders)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<typeof sampleOrders[0] | null>(null)

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Update order status
  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#2D1810]">Orders</h1>
        <p className="text-[#5C4033] mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C4033]" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D42426]"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D42426]"
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-[#8B7D6B] mb-4" />
            <p className="text-[#8B7D6B] text-lg">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FDF8F0]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock
                  return (
                    <tr key={order.id} className="hover:bg-[#FDF8F0]/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-[#2D1810]">{order.id}</span>
                        <p className="text-xs text-[#5C4033] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#2D1810]">{order.customer.name}</p>
                        <p className="text-sm text-[#5C4033]">{order.customer.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#5C4033]">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-[#2D1810]">£{order.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#2D1810]">
                          {new Date(order.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-[#5C4033]">{order.pickupTime}</p>
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
                          className="flex items-center gap-1 text-[#D42426] font-medium hover:underline"
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
      <div className="mt-4 text-sm text-[#5C4033]">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#2D1810]">Order {selectedOrder.id}</h2>
                <p className="text-sm text-[#5C4033]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-[#5C4033] hover:text-[#2D1810] text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-[#5C4033] mb-2">Status</h3>
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
                <h3 className="text-sm font-medium text-[#5C4033] mb-2">Customer</h3>
                <div className="bg-[#FDF8F0] rounded-lg p-4">
                  <p className="font-medium text-[#2D1810]">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-[#5C4033]">{selectedOrder.customer.email}</p>
                  <p className="text-sm text-[#5C4033]">{selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Pickup Info */}
              <div>
                <h3 className="text-sm font-medium text-[#5C4033] mb-2">Pickup Details</h3>
                <div className="bg-[#FDF8F0] rounded-lg p-4">
                  <p className="text-[#2D1810]">
                    <span className="font-medium">Date:</span> {new Date(selectedOrder.pickupDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-[#2D1810]">
                    <span className="font-medium">Time:</span> {selectedOrder.pickupTime}
                  </p>
                  <p className="text-[#2D1810]">
                    <span className="font-medium">Method:</span> {selectedOrder.deliveryMethod === 'delivery' ? 'Delivery' : 'Collection'}
                  </p>
                  {selectedOrder.deliveryAddress && (
                    <p className="text-[#2D1810]">
                      <span className="font-medium">Address:</span> {selectedOrder.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-[#5C4033] mb-2">Items</h3>
                <div className="border border-[#E8DDD0] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#FDF8F0]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#5C4033]">Item</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-[#5C4033]">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#5C4033]">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#5C4033]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DDD0]">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-[#2D1810]">{item.name}</td>
                          <td className="px-4 py-2 text-center text-[#5C4033]">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-[#5C4033]">£{item.price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right text-[#2D1810] font-medium">£{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#FDF8F0]">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium text-[#2D1810]">Subtotal</td>
                        <td className="px-4 py-2 text-right text-[#2D1810]">£{selectedOrder.subtotal.toFixed(2)}</td>
                      </tr>
                      {selectedOrder.deliveryFee > 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right text-[#5C4033]">Delivery</td>
                          <td className="px-4 py-2 text-right text-[#5C4033]">£{selectedOrder.deliveryFee.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-bold text-[#2D1810]">Total</td>
                        <td className="px-4 py-2 text-right font-bold text-[#D42426]">£{selectedOrder.total.toFixed(2)}</td>
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
                className="px-4 py-2 border border-[#E8DDD0] rounded-lg text-[#5C4033] hover:bg-[#FDF8F0] transition-colors"
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
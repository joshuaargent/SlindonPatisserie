import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight
} from 'lucide-react'

// Sample stats - in production these come from database
const stats = [
  { 
    name: 'Total Products', 
    value: '16', 
    change: '+2', 
    changeType: 'positive',
    icon: Package 
  },
  { 
    name: 'Pending Orders', 
    value: '8', 
    change: '-3', 
    changeType: 'negative',
    icon: ShoppingCart 
  },
  { 
    name: 'Total Users', 
    value: '45', 
    change: '+5', 
    changeType: 'positive',
    icon: Users 
  },
  { 
    name: 'Revenue (Month)', 
    value: '£2,847', 
    change: '+12%', 
    changeType: 'positive',
    icon: DollarSign 
  },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Mitchell', items: 3, total: 24.50, status: 'pending', time: '10 min ago' },
  { id: 'ORD-002', customer: 'James Wilson', items: 5, total: 45.00, status: 'confirmed', time: '25 min ago' },
  { id: 'ORD-003', customer: 'Emma Thompson', items: 2, total: 12.80, status: 'ready', time: '1 hour ago' },
  { id: 'ORD-004', customer: 'Robert Brown', items: 8, total: 68.00, status: 'pending', time: '2 hours ago' },
  { id: 'ORD-005', customer: 'Lisa Anderson', items: 4, total: 35.50, status: 'confirmed', time: '3 hours ago' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
}

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Dashboard</h1>
        <p className="text-[#6B5344] mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#8B1E22]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#8B1E22]" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#3A2C2A]">{stat.value}</h3>
              <p className="text-[#6B5344] text-sm">{stat.name}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/products/new"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-[#8B1E22] flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#3A2C2A]">Add New Product</h3>
            <p className="text-sm text-[#6B5344]">Create a new product listing</p>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-[#8B1E22] flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#3A2C2A]">View Orders</h3>
            <p className="text-sm text-[#6B5344]">Manage pending orders</p>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-[#D0A246] flex items-center justify-center">
            <span className="text-2xl text-[#3A2C2A]">🏷️</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#3A2C2A]">Manage Categories</h3>
            <p className="text-sm text-[#6B5344]">Organize product categories</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#3A2C2A]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-[#8B1E22] font-medium hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD0]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F2E9]/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-[#3A2C2A]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[#3A2C2A]">{order.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#6B5344]">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-[#3A2C2A]">£{order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#6B5344]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {order.time}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-[#8B1E22] font-medium hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
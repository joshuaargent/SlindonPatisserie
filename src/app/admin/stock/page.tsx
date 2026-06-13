'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Loader2,
  Edit3,
  Save,
  X,
  TrendingDown,
  Layers,
  ChevronDown
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string
  retailPrice: number
  stockQuantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  available: boolean
  image: string | null
}

interface Stats {
  total: number
  inStock: number
  lowStock: number
  outOfStock: number
  unavailable: number
}

const statusConfig = {
  in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  low_stock: { label: 'Low Stock', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0, unavailable: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  // Fetch products and categories
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterCategory !== 'all') params.set('category', filterCategory)
      if (filterStatus === 'low') params.set('lowStock', 'true')
      if (search) params.set('search', search)
      
      const response = await fetch(`/api/admin/products/stock?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [filterCategory, filterStatus, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch categories
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(console.error)
  }, [])

  // Start editing stock
  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditValue(product.stockQuantity.toString())
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  // Save stock edit
  const saveEdit = async (productId: string) => {
    const newQuantity = parseInt(editValue, 10)
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Please enter a valid quantity')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/products/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stockQuantity: newQuantity }),
      })
      
      if (response.ok) {
        fetchProducts()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to update stock:', error)
    } finally {
      setSaving(false)
    }
  }

  // Toggle product availability
  const toggleAvailability = async (product: Product) => {
    try {
      const response = await fetch('/api/admin/products/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, available: !product.available }),
      })
      
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to toggle availability:', error)
    }
  }

  // Quick adjust stock (+/- buttons)
  const quickAdjust = async (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    
    const newQuantity = Math.max(0, product.stockQuantity + delta)
    
    try {
      await fetch('/api/admin/products/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stockQuantity: newQuantity }),
      })
      fetchProducts()
    } catch (error) {
      console.error('Failed to adjust stock:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Stock Management</h1>
        <p className="text-[#6B5344] mt-1">Monitor and manage product inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#3A2C2A]">{stats.total}</p>
              <p className="text-sm text-[#6B5344]">Total Products</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#3A2C2A]">{stats.inStock}</p>
              <p className="text-sm text-[#6B5344]">In Stock</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#3A2C2A]">{stats.lowStock}</p>
              <p className="text-sm text-[#6B5344]">Low Stock</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#3A2C2A]">{stats.outOfStock}</p>
              <p className="text-sm text-[#6B5344]">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5344]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="low">Show Low Stock Only</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 mx-auto text-[#8B1E22] animate-spin mb-4" />
            <p className="text-[#6B5344]">Loading stock data...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-[#6B5344] mb-4" />
            <p className="text-[#6B5344] text-lg">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F2E9]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {products.map((product) => {
                  const StatusIcon = statusConfig[product.status].icon
                  return (
                    <tr key={product.id} className={`hover:bg-[#F7F2E9]/50 ${!product.available ? 'bg-gray-50 opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F7F2E9] rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#6B5344]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#3A2C2A]">{product.name}</p>
                            {!product.available && (
                              <span className="text-xs text-red-600">Disabled</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6B5344]">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === product.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 px-2 py-1 border border-[#E8DDD0] rounded text-center focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(product.id)
                                if (e.key === 'Escape') cancelEdit()
                              }}
                            />
                            <button
                              onClick={() => saveEdit(product.id)}
                              disabled={saving}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => quickAdjust(product.id, -1)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              -
                            </button>
                            <span className={`w-16 text-center font-medium ${
                              product.stockQuantity <= 0 ? 'text-red-600' :
                              product.stockQuantity <= 10 ? 'text-orange-600' : 
                              'text-[#3A2C2A]'
                            }`}>
                              {product.stockQuantity}
                            </span>
                            <button
                              onClick={() => quickAdjust(product.id, 1)}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit mx-auto ${statusConfig[product.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[product.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-[#3A2C2A]">
                        £{product.retailPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 text-[#6B5344] hover:text-[#8B1E22] hover:bg-[#F7F2E9] rounded-lg transition-colors"
                            title="Edit stock"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleAvailability(product)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.available 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={product.available ? 'Disable product' : 'Enable product'}
                          >
                            {product.available ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Count */}
      <div className="mt-4 text-sm text-[#6B5344]">
        Showing {products.length} products
      </div>
    </div>
  )
}
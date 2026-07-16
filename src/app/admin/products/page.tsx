'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Loader2,
  X,
  Save,
  AlertCircle
} from 'lucide-react'

// Category type from database
interface Category {
  id: string
  name: string
  slug: string
}

// Product type matching database schema
interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  category?: Category | string
  retailPrice: number
  wholesalePrice: number | null
  image: string | null
  available: boolean
  leadTimeDays: number
  availability: string // RETAIL, WHOLESALE, or BOTH
  madeAtFactoryA: boolean
  madeAtFactoryB: boolean
  featured?: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [error, setError] = useState<string | null>(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    retailPrice: '',
    wholesalePrice: '',
    image: '',
    available: true,
    leadTimeDays: '1',
    madeAtFactoryA: true,
    madeAtFactoryB: false,
    availability: 'RETAIL', // RETAIL, WHOLESALE, or BOTH
  })
  const [saving, setSaving] = useState(false)

  // Fetch categories from database
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  // Fetch products from admin API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else if (response.status === 401) {
        setError('Please log in to access the admin dashboard.')
      } else if (response.status === 403) {
        setError('You do not have admin access.')
      } else {
        setError('Failed to load products. Please try again.')
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [fetchCategories, fetchProducts])

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const cat = categories.find(c => c.id === categoryId)
    return cat?.name || 'Unknown'
  }

  // Get category slug for filtering
  const getCategorySlug = (product: Product): string => {
    if (typeof product.category === 'string') return product.category
    if (typeof product.category === 'object' && product.category?.slug) return product.category.slug
    return ''
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    const productCategorySlug = getCategorySlug(product)
    const matchesCategory = filterCategory === 'all' || productCategorySlug === filterCategory || product.categoryId === filterCategory
    return matchesSearch && matchesCategory
  })

  // Open modal for new/edit
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        retailPrice: product.retailPrice.toString(),
        wholesalePrice: product.wholesalePrice?.toString() || '',
        image: product.image || '',
        available: product.available,
        leadTimeDays: (product.leadTimeDays || 1).toString(),
        madeAtFactoryA: product.madeAtFactoryA,
        madeAtFactoryB: product.madeAtFactoryB,
        availability: product.availability || 'RETAIL',
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        categoryId: categories[0]?.id || '',
        retailPrice: '',
        wholesalePrice: '',
        image: '',
        available: true,
        leadTimeDays: '1',
        madeAtFactoryA: true,
        madeAtFactoryB: false,
        availability: 'RETAIL',
      })
    }
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Save product
  const handleSave = async () => {
    if (!formData.categoryId) {
      alert('Please select a category')
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        retailPrice: parseFloat(formData.retailPrice),
        wholesalePrice: formData.wholesalePrice ? parseFloat(formData.wholesalePrice) : null,
        image: formData.image || null,
        available: formData.available,
        leadTimeDays: parseInt(formData.leadTimeDays) || 1,
        madeAtFactoryA: formData.madeAtFactoryA,
        madeAtFactoryB: formData.madeAtFactoryB,
        availability: formData.availability,
      }

      const url = editingProduct ? `/api/admin/products?id=${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct ? { ...payload, id: editingProduct.id } : payload),
      })

      if (response.ok) {
        await fetchProducts()
        closeModal()
      } else if (response.status === 401) {
        alert('Please log in to save products.')
      } else if (response.status === 403) {
        alert('You do not have permission to save products.')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Products</h1>
          <p className="text-[#6B5344] mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-secondary-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">{error}</p>
            {error.includes('log in') && (
              <Link href="/login" className="text-red-600 underline mt-1 inline-block">
                Go to Login
              </Link>
            )}
          </div>
        </div>
      )}

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
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#8B1E22] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-[#6B5344] mb-4" />
            <p className="text-[#6B5344] text-lg">No products found</p>
            {!error && (
              <button
                onClick={() => openModal()}
                className="mt-4 text-[#8B1E22] hover:underline"
              >
                Add your first product
              </button>
            )}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5344] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F7F2E9]/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#3A2C2A]">{product.name}</div>
                      <div className="text-sm text-[#6B5344] line-clamp-1">{product.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F7F2E9] text-[#6B5344]">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-[#3A2C2A]">£{product.retailPrice.toFixed(2)}</span>
                      {product.wholesalePrice && (
                        <span className="ml-2 text-sm text-[#6B5344]">/ £{product.wholesalePrice.toFixed(2)} wholesale</span>
                      )}
                      <div className="flex gap-1 mt-1">
                        {product.availability === 'RETAIL' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Retail
                          </span>
                        )}
                        {product.availability === 'WHOLESALE' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Wholesale
                          </span>
                        )}
                        {product.availability === 'BOTH' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Both
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-[#6B5344] hover:text-[#8B1E22] transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-[#6B5344] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#3A2C2A]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-[#6B5344] hover:text-[#3A2C2A]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="e.g., Butter Croissant"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] resize-none"
                  placeholder="Describe the product..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                    Retail Price (£) *
                  </label>
                  <input
                    type="number"
                    name="retailPrice"
                    value={formData.retailPrice}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                    placeholder="2.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                    Wholesale Price (£)
                  </label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    value={formData.wholesalePrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                    placeholder="1.25"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Available For
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                >
                  <option value="RETAIL">Retail Only</option>
                  <option value="WHOLESALE">Wholesale Only</option>
                  <option value="BOTH">Both Retail &amp; Wholesale</option>
                </select>
                <p className="text-xs text-[#6B5344] mt-1">
                  {formData.availability === 'RETAIL' && 'Product will only appear in retail store'}
                  {formData.availability === 'WHOLESALE' && 'Product will only appear in wholesale store'}
                  {formData.availability === 'BOTH' && 'Product will appear in both retail and wholesale'}
                </p>
              </div>

              {/* Lead Time */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Lead Time (days)
                </label>
                <input
                  type="number"
                  name="leadTimeDays"
                  value={formData.leadTimeDays}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="1"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="https://..."
                />
              </div>

              {/* Factory Routing */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Made At
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="madeAtFactoryA"
                      checked={formData.madeAtFactoryA}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-[#E8DDD0] text-[#8B1E22] focus:ring-[#8B1E22]"
                    />
                    <span className="text-[#6B5344]">Factory A</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="madeAtFactoryB"
                      checked={formData.madeAtFactoryB}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-[#E8DDD0] text-[#8B1E22] focus:ring-[#8B1E22]"
                    />
                    <span className="text-[#6B5344]">Factory B</span>
                  </label>
                </div>
              </div>

              {/* Available */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-[#E8DDD0] text-[#8B1E22] focus:ring-[#8B1E22]"
                  />
                  <span className="text-[#3A2C2A] font-medium">Product is available for sale</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#E8DDD0] flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-[#E8DDD0] rounded-lg text-[#6B5344] hover:bg-[#F7F2E9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.categoryId || !formData.retailPrice}
                className="btn-secondary-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

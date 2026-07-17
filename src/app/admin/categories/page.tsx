'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Loader2,
  X,
  Save,
  Package
} from 'lucide-react'

// Category type from database
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Emoji and color mapping (stored in description or derived from name)
const emojiMap: Record<string, string> = {
  bakery: '🥐',
  bread: '🍞',
  patisserie: '🥐',
  catering: '🥪',
  wholesale: '📦',
  pos: '🛍️',
  sundries: '🛒',
  default: '🧁',
}

const colorOptions = [
  '#8B1E22', '#D0A246', '#6B5344', '#3A2C2A',
  '#2563EB', '#059669', '#7C3AED', '#DB2777', '#EA580C', '#0891B2',
]

const emojiOptions = ['🥐', '🍞', '🥖', '🥪', '🍰', '🧁', '🥧', '🍩', '🍪', '📦', '🛒', '🛍️', '☕', '🍵', '🥤']

function getEmoji(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lower.includes(key)) return emoji
  }
  return emojiMap.default
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [saving, setSaving] = useState(false)

  // Fetch categories and product counts
  useEffect(() => {
    fetchCategories()
    fetchProductCounts()
  }, [])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProductCounts() {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      const counts: Record<string, number> = {}
      data.products?.forEach((product: { categoryId: string }) => {
        if (product.categoryId) {
          counts[product.categoryId] = (counts[product.categoryId] || 0) + 1
        }
      })
      setProductCounts(counts)
    } catch (error) {
      console.error('Failed to fetch product counts:', error)
    }
  }

  // Open modal for new/edit
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
      })
    }
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, name, slug: prev.slug || slug }))
  }

  // Save category
  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('Please fill in name and slug')
      return
    }

    setSaving(true)
    try {
      const url = editingCategory 
        ? '/api/admin/categories' 
        : '/api/admin/categories'
      const method = editingCategory ? 'PATCH' : 'POST'
      const body = editingCategory 
        ? { id: editingCategory.id, name: formData.name, slug: formData.slug, description: formData.description }
        : { name: formData.name, slug: formData.slug, description: formData.description }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        await fetchCategories()
        closeModal()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save category')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  // Delete category
  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id)
    const count = productCounts[id] || 0
    
    if (count > 0) {
      alert(`Cannot delete "${category?.name}" - it has ${count} products. Remove or reassign products first.`)
      return
    }
    
    if (!confirm(`Are you sure you want to delete "${category?.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete category')
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B1E22]" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Categories</h1>
          <p className="text-[#6B5344] mt-1">Organize your products with categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-secondary-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Tag className="w-12 h-12 text-[#6B5344] mx-auto mb-4" />
          <p className="text-[#6B5344]">No categories yet. Add your first category to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Category Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-[#F7F2E9]">
                  {getEmoji(category.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#3A2C2A] text-lg">{category.name}</h3>
                  <p className="text-sm text-[#6B5344]">/{category.slug}</p>
                </div>
              </div>

              {/* Description */}
              {category.description && (
                <p className="text-sm text-[#6B5344] mb-4 line-clamp-2">{category.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between py-3 border-t border-[#E8DDD0]">
                <div className="flex items-center gap-2 text-[#6B5344]">
                  <Package className="w-4 h-4" />
                  <span>{productCounts[category.id] || 0} products</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-[#6B5344] hover:text-[#8B1E22] transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-[#6B5344] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2 mt-3">
                <span className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-xs text-[#6B5344]">{category.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Count */}
      <div className="mt-6 text-sm text-[#6B5344]">
        {categories.length} categories
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#3A2C2A]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="e.g., Patisserie, Artisan Bread"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="e.g., patisserie, artisan-bread"
                />
                <p className="text-xs text-[#6B5344] mt-1">Used in URL: /products?category=your-slug</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="Optional description for this category"
                />
              </div>

              {/* Emoji Preview */}
              <div>
                <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Preview Icon
                </label>
                <div className="flex items-center gap-3 p-3 bg-[#F7F2E9] rounded-lg">
                  <span className="text-3xl">{getEmoji(formData.name)}</span>
                  <span className="text-sm text-[#6B5344]">
                    Icon is auto-selected based on category name
                  </span>
                </div>
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
                disabled={saving || !formData.name || !formData.slug}
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
                    Save Category
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
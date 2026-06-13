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

// Category type
interface Category {
  id: string
  name: string
  label: string
  emoji: string
  color: string
  productCount: number
}

// Predefined categories
const defaultCategories: Category[] = [
  { id: '1', name: 'bakery', label: 'Patisserie', emoji: '🥐', color: '#8B1E22', productCount: 0 },
  { id: '2', name: 'bread', label: 'Artisan Bread', emoji: '🍞', color: '#8B5A2B', productCount: 0 },
  { id: '3', name: 'catering', label: 'Catering', emoji: '🥪', color: '#D0A246', productCount: 0 },
  { id: '4', name: 'wholesale', label: 'Wholesale', emoji: '📦', color: '#4A3728', productCount: 0 },
  { id: '5', name: 'pos', label: 'POS & Supplies', emoji: '🛍️', color: '#6B5B4F', productCount: 0 },
  { id: '6', name: 'sundries', label: 'Sundries', emoji: '🛒', color: '#2D1810', productCount: 0 },
]

const colorOptions = [
  '#8B1E22', '#8B5A2B', '#D0A246', '#4A3728', '#6B5B4F', '#2D1810',
  '#2563EB', '#059669', '#7C3AED', '#DB2777', '#EA580C', '#0891B2',
]

const emojiOptions = ['🥐', '🍞', '🥖', '🥪', '🍰', '🧁', '🥧', '🍩', '🍪', '📦', '🛒', '🛍️', '☕', '🍵', '🥤']

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    emoji: '🥐',
    color: '#8B1E22',
  })
  const [saving, setSaving] = useState(false)

  // Fetch products to get counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          const productCounts: Record<string, number> = {}
          data.products.forEach((product: { category: string }) => {
            productCounts[product.category] = (productCounts[product.category] || 0) + 1
          })
          setCategories(prev => prev.map(cat => ({
            ...cat,
            productCount: productCounts[cat.name] || 0
          })))
        }
      } catch (error) {
        console.error('Failed to fetch product counts:', error)
      }
    }
    fetchCounts()
  }, [])

  // Open modal for new/edit
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        label: category.label,
        emoji: category.emoji,
        color: category.color,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        label: '',
        emoji: '🥐',
        color: '#8B1E22',
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Save category
  const handleSave = () => {
    if (!formData.name || !formData.label) {
      alert('Please fill in all required fields')
      return
    }

    // For now, just update local state (in production, would call API)
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: formData.name, label: formData.label, emoji: formData.emoji, color: formData.color }
          : cat
      ))
    } else {
      setCategories(prev => [...prev, {
        id: `new-${Date.now()}`,
        name: formData.name,
        label: formData.label,
        emoji: formData.emoji,
        color: formData.color,
        productCount: 0,
      }])
    }
    closeModal()
  }

  // Delete category
  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category && category.productCount > 0) {
      alert(`Cannot delete "${category.label}" - it has ${category.productCount} products. Remove or reassign products first.`)
      return
    }
    if (confirm(`Are you sure you want to delete "${category?.label}"?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2D1810]">Categories</h1>
          <p className="text-[#5C4033] mt-1">Organize your products with categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#8B1E22] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#B81E20] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#2D1810] text-lg">{category.label}</h3>
                <p className="text-sm text-[#5C4033]">{category.name}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between py-3 border-t border-[#E8DDD0]">
              <div className="flex items-center gap-2 text-[#5C4033]">
                <Package className="w-4 h-4" />
                <span>{category.productCount} products</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(category)}
                  className="p-2 text-[#5C4033] hover:text-[#8B1E22] transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-[#5C4033] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-[#5C4033]">Color:</span>
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Category Count */}
      <div className="mt-6 text-sm text-[#5C4033]">
        {categories.length} categories
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8DDD0] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2D1810]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={closeModal} className="text-[#5C4033] hover:text-[#2D1810]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name (slug) */}
              <div>
                <label className="block text-sm font-medium text-[#2D1810] mb-1">
                  URL Name (slug) *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="e.g., bakery, bread, catering"
                />
                <p className="text-xs text-[#5C4033] mt-1">Used in URL: /products?category=your-name</p>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-[#2D1810] mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                  placeholder="e.g., Patisserie, Artisan Bread"
                />
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-[#2D1810] mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                        formData.emoji === emoji
                          ? 'bg-[#8B1E22] text-white'
                          : 'bg-[#FDF8F0] hover:bg-[#E8DDD0]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-[#2D1810] mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-[#8B1E22] scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#E8DDD0] flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-[#E8DDD0] rounded-lg text-[#5C4033] hover:bg-[#FDF8F0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.label}
                className="flex items-center gap-2 bg-[#8B1E22] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#B81E20] transition-colors disabled:opacity-50"
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
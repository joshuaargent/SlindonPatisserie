'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, ShoppingBag, Package, Loader2, ShoppingBagIcon } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart'

// Product type matching database schema
interface Product {
  id: string
  name: string
  description: string
  category: string
  retailPrice: number
  wholesalePrice: number | null
  image: string | null
  available: boolean
  productionTimeHours: number
  madeAtFactoryA: boolean
  madeAtFactoryB: boolean
}

// Category display configuration
const categoryConfig: Record<string, { label: string; emoji: string }> = {
  bakery: { label: 'Patisserie', emoji: '🥐' },
  bread: { label: 'Artisan Bread', emoji: '🍞' },
  catering: { label: 'Catering', emoji: '🥪' },
  wholesale: { label: 'Wholesale Boxes', emoji: '📦' },
  pos: { label: 'POS & Supplies', emoji: '🛍️' },
  sundries: { label: 'Sundries', emoji: '🛒' },
}

const defaultCategoryConfig = { label: 'Other', emoji: '🧁' }

// ============================================
// Products Page - Dynamic from Database
// ============================================

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showRetailPrices, setShowRetailPrices] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }
      params.set('available', 'true')
      params.set('includeWholesale', 'true')

      const response = await fetch(`/api/products?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products)
      setCategories(data.categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Fall back to empty products if API fails
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    const price = showRetailPrices 
      ? product.retailPrice 
      : (product.wholesalePrice ?? product.retailPrice)

    addItem({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      productionTime: product.productionTimeHours,
      category: product.category,
    })
    
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  // Get category display info
  const getCategoryInfo = (category: string) => {
    return categoryConfig[category] || defaultCategoryConfig
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="bg-[#D42426] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm hover:text-[#F5C518] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm hover:text-[#F5C518] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#2D1810] mb-2">
            Our Products
          </h1>
          <p className="text-[#5C4033]">
            Fresh from our ovens every day. Same products, better prices for wholesale.
          </p>
        </div>

        {/* Price Toggle - Retail vs Wholesale */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#5C4033] font-medium">Show prices:</span>
            
            <button
              onClick={() => setShowRetailPrices(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showRetailPrices
                  ? 'bg-[#D42426] text-white'
                  : 'bg-[#FDF8F0] text-[#5C4033] hover:bg-[#E8DDD0]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Retail
            </button>
            
            <button
              onClick={() => setShowRetailPrices(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                !showRetailPrices
                  ? 'bg-[#D42426] text-white'
                  : 'bg-[#FDF8F0] text-[#5C4033] hover:bg-[#E8DDD0]'
              }`}
            >
              <Package className="w-4 h-4" />
              Wholesale
              <span className="text-xs bg-[#F5C518] text-[#2D1810] px-2 py-0.5 rounded font-bold">
                50% OFF
              </span>
            </button>
            
            {!showRetailPrices && (
              <span className="text-sm text-[#5C4033]">
                Log in or apply for wholesale account to see these prices
              </span>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#D42426] text-white'
                : 'bg-white text-[#5C4033] hover:bg-[#E8DDD0]'
            }`}
          >
            🧁 All Products
          </button>
          {categories.map((cat) => {
            const info = getCategoryInfo(cat)
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-[#D42426] text-white'
                    : 'bg-white text-[#5C4033] hover:bg-[#E8DDD0]'
                }`}
              >
                <span>{info.emoji}</span>
                {info.label}
              </button>
            )
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D42426] animate-spin" />
            <span className="ml-3 text-[#5C4033]">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white rounded-xl">
            <ShoppingBagIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-[#D42426] text-white rounded-lg hover:bg-[#B81E20]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <ShoppingBagIcon className="w-16 h-16 mx-auto text-[#8B7D6B] mb-4" />
            <p className="text-[#8B7D6B] text-lg">
              {selectedCategory === 'all' 
                ? 'No products available yet. Check back soon!' 
                : 'No products in this category.'}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-[#D42426] font-medium hover:underline"
              >
                View all products
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const displayPrice = showRetailPrices 
                ? product.retailPrice 
                : (product.wholesalePrice ?? product.retailPrice)
              const hasWholesale = product.wholesalePrice !== null
              const savings = hasWholesale && product.wholesalePrice
                ? ((product.retailPrice - product.wholesalePrice) / product.retailPrice * 100).toFixed(0)
                : 0
              const categoryInfo = getCategoryInfo(product.category)

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-[#FDF8F0] relative flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">{categoryInfo.emoji}</span>
                    )}
                    
                    {Number(savings) > 0 && !showRetailPrices && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-[#4A3728] text-white text-xs font-bold rounded">
                        Save {savings}%
                      </span>
                    )}
                    
                    {!product.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white px-3 py-1 rounded text-sm font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs bg-[#FDF8F0] text-[#5C4033] rounded mb-2 uppercase tracking-wide">
                      {categoryInfo.label}
                    </span>
                    
                    <h3 className="font-semibold text-[#2D1810] text-lg">{product.name}</h3>
                    <p className="text-sm text-[#5C4033] mt-1 line-clamp-2">{product.description}</p>
                    
                    {product.productionTimeHours > 0 && (
                      <p className="text-xs text-[#8B7D6B] mt-2">
                        Ready in ~{product.productionTimeHours}h
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#D42426]">
                          £{displayPrice.toFixed(2)}
                        </span>
                        {hasWholesale && showRetailPrices && (
                          <span className="text-sm text-[#5C4033] ml-2 line-through">
                            £{product.retailPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart === product.id || !product.available}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          addedToCart === product.id
                            ? 'bg-green-500 text-white'
                            : !product.available
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#D42426] text-white hover:bg-[#B81E20]'
                        }`}
                      >
                        {addedToCart === product.id ? '✓ Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-[#4A3728] text-white rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-2">Production Time Notice</h3>
          <p className="text-white/80">
            All our products are made fresh to order. When selecting your pickup time at checkout, 
            please allow at least the production time shown for your items. Need it sooner? 
            <Link href="/contact" className="text-[#F5C518] hover:underline ml-1">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
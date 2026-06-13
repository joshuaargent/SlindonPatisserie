'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ShoppingCart, ShoppingBag, Package, Loader2, ShoppingBagIcon, Lock } from 'lucide-react'
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
  
  const { data: session, status } = useSession()
  const addItem = useCartStore((state) => state.addItem)

  // Determine if user can see wholesale pricing
  const canSeeWholesale = status === 'authenticated' && session?.user?.role === 'wholesale'
  
  // If not logged in, default to retail prices
  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowRetailPrices(true)
    } else if (canSeeWholesale) {
      // Wholesale users can see wholesale by default
      setShowRetailPrices(false)
    }
  }, [status, canSeeWholesale])

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
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <div className="bg-[#8B1E22] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm hover:text-[#D0A246] transition-colors"
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
          <h1 className="text-4xl font-serif font-bold text-[#3A2C2A] mb-2">
            Our Products
          </h1>
          <p className="text-[#6B5344]">
            Fresh from our ovens every day. Order online and collect from our Camberley bakery.
          </p>
        </div>

        {/* Price Toggle - Retail vs Wholesale */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#6B5344] font-medium">Show prices:</span>
            
            <button
              onClick={() => setShowRetailPrices(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showRetailPrices
                  ? 'bg-[#8B1E22] text-white'
                  : 'bg-[#F7F2E9] text-[#6B5344] hover:bg-[#E8DDD0]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Retail
            </button>
            
            {/* Wholesale toggle - only enabled for wholesale users */}
            {canSeeWholesale ? (
              <button
                onClick={() => setShowRetailPrices(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  !showRetailPrices
                    ? 'bg-[#8B1E22] text-white'
                    : 'bg-[#F7F2E9] text-[#6B5344] hover:bg-[#E8DDD0]'
                }`}
              >
                <Package className="w-4 h-4" />
                Wholesale
                <span className="text-xs bg-[#D0A246] text-white px-2 py-0.5 rounded font-bold">
                  50% OFF
                </span>
              </button>
            ) : (
              <div className="relative">
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  <Package className="w-4 h-4" />
                  Wholesale
                  <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded font-bold">
                    50% OFF
                  </span>
                </button>
                {status === 'unauthenticated' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#E8DDD0] p-4 z-10">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-[#D0A246] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#3A2C2A] text-sm">Wholesale Login Required</p>
                        <p className="text-xs text-[#6B5344] mt-1">
                          <Link href="/login" className="text-[#8B1E22] underline">Sign in</Link> or{' '}
                          <Link href="/wholesale" className="text-[#8B1E22] underline">apply for a wholesale account</Link> to see trade pricing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#8B1E22] text-white'
                : 'bg-white text-[#6B5344] hover:bg-[#E8DDD0]'
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
                    ? 'bg-[#8B1E22] text-white'
                    : 'bg-white text-[#6B5344] hover:bg-[#E8DDD0]'
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
            <Loader2 className="w-8 h-8 text-[#8B1E22] animate-spin" />
            <span className="ml-3 text-[#6B5344]">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white rounded-xl">
            <ShoppingBagIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-[#8B1E22] text-white rounded-lg hover:bg-[#9B2A32]"
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
                className="mt-4 text-[#8B1E22] font-medium hover:underline"
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
                  <div className="aspect-square bg-[#F7F2E9] relative flex items-center justify-center">
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
                      <span className="absolute top-3 right-3 px-2 py-1 bg-[#8B1E22] text-white text-xs font-bold rounded">
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
                    <span className="inline-block px-2 py-1 text-xs bg-[#F7F2E9] text-[#6B5344] rounded mb-2 uppercase tracking-wide">
                      {categoryInfo.label}
                    </span>
                    
                    <h3 className="font-semibold text-[#3A2C2A] text-lg">{product.name}</h3>
                    <p className="text-sm text-[#6B5344] mt-1 line-clamp-2">{product.description}</p>
                    
                    {product.productionTimeHours > 0 && (
                      <p className="text-xs text-[#8B7D6B] mt-2">
                        Ready in ~{product.productionTimeHours}h
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#8B1E22]">
                          £{displayPrice.toFixed(2)}
                        </span>
                        {hasWholesale && showRetailPrices && (
                          <span className="text-sm text-[#6B5344] ml-2 line-through">
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
                            : 'bg-[#8B1E22] text-white hover:bg-[#9B2A32]'
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
        <div className="mt-12 bg-[#8B1E22] text-white rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-2">Production Time Notice</h3>
          <p className="text-white/80">
            All our products are made fresh to order. When selecting your pickup time at checkout, 
            please allow at least the production time shown for your items. Need it sooner? 
            <Link href="/contact" className="text-[#D0A246] hover:underline ml-1">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
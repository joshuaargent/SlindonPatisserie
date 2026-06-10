'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Filter, Plus, Minus, ShoppingBag, Package } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart'

// Product categories with display names
const categories = [
  { id: 'all', label: 'All Products', emoji: '🧁' },
  { id: 'patisserie', label: 'Patisserie', emoji: '🥐' },
  { id: 'bread', label: 'Artisan Bread', emoji: '🍞' },
  { id: 'catering', label: 'Catering', emoji: '🥪' },
  { id: 'wholesale', label: 'Wholesale Boxes', emoji: '📦' },
  { id: 'sundries', label: 'Sundries', emoji: '🛍️' },
]

// Sample products with BOTH retail and wholesale prices
// In production, these come from the database with user-type-based pricing
const allProducts = [
  // PATISSERIE
  {
    id: '1',
    name: 'Butter Croissant',
    description: 'Flaky, buttery French croissant made with finest French butter. Golden and crispy on the outside.',
    retailPrice: 2.50,
    wholesalePrice: 1.25, // 50% off
    category: 'patisserie',
    productionHours: 8,
    emoji: '🥐',
  },
  {
    id: '2',
    name: 'Pain au Chocolat',
    description: 'Classic French pastry with rich dark chocolate batons wrapped in buttery layers.',
    retailPrice: 2.80,
    wholesalePrice: 1.40,
    category: 'patisserie',
    productionHours: 8,
    emoji: '🍫',
  },
  {
    id: '3',
    name: 'Almond Croissant',
    description: 'Croissant filled with almond cream and topped with flaked almonds and icing sugar.',
    retailPrice: 3.20,
    wholesalePrice: 1.60,
    category: 'patisserie',
    productionHours: 10,
    emoji: '🥐',
  },
  {
    id: '4',
    name: 'Pain aux Raisins',
    description: 'Spiral pastry with custard and raisins, dusted with sugar.',
    retailPrice: 2.70,
    wholesalePrice: 1.35,
    category: 'patisserie',
    productionHours: 10,
    emoji: '🍇',
  },
  {
    id: '5',
    name: 'Danish Pastry Selection',
    description: 'Assorted Danish pastries - apple, apricot, cheese. Ask for availability.',
    retailPrice: 3.00,
    wholesalePrice: 1.50,
    category: 'patisserie',
    productionHours: 8,
    emoji: '🥧',
  },

  // BREAD
  {
    id: '6',
    name: 'Sourdough Boule',
    description: 'Rustic round loaf with a caramelized crust and tangy, open crumb. 48-hour fermentation.',
    retailPrice: 4.50,
    wholesalePrice: 2.25,
    category: 'bread',
    productionHours: 48,
    emoji: '🍞',
  },
  {
    id: '7',
    name: 'French Baguette',
    description: 'Traditional long loaf with a crispy crust and light, airy interior.',
    retailPrice: 2.20,
    wholesalePrice: 1.10,
    category: 'bread',
    productionHours: 4,
    emoji: '🥖',
  },
  {
    id: '8',
    name: 'Ciabatta',
    description: 'Italian-style bread with a soft, open crumb and thin, crispy crust.',
    retailPrice: 3.00,
    wholesalePrice: 1.50,
    category: 'bread',
    productionHours: 6,
    emoji: '🍞',
  },

  // CATERING
  {
    id: '9',
    name: 'Mini Sandwich Selection (8)',
    description: 'Assorted mini sandwiches: cucumber, egg mayo, ham & mustard, cheese & pickle. Serves 4.',
    retailPrice: 15.00,
    wholesalePrice: 7.50,
    category: 'catering',
    productionHours: 4,
    emoji: '🥪',
  },
  {
    id: '10',
    name: 'Cream Tea for Two',
    description: 'Two plain scones, clotted cream, strawberry jam, and a pot of loose leaf tea.',
    retailPrice: 12.00,
    wholesalePrice: 6.00,
    category: 'catering',
    productionHours: 2,
    emoji: '☕',
  },
  {
    id: '11',
    name: 'Savory Platter',
    description: 'Selection of quiches, sausage rolls, and savory tarts. Serves 8-10.',
    retailPrice: 35.00,
    wholesalePrice: 17.50,
    category: 'catering',
    productionHours: 8,
    emoji: '🍽️',
  },
  {
    id: '12',
    name: 'Pastry Selection Box (12)',
    description: '12 assorted Danish pastries and croissants. Ideal for meetings.',
    retailPrice: 28.00,
    wholesalePrice: 14.00,
    category: 'catering',
    productionHours: 12,
    emoji: '📦',
  },

  // WHOLESALE BOXES
  {
    id: '13',
    name: 'Croissant Box (30)',
    description: 'Box of 30 premium butter croissants. Bulk pricing for cafes and shops.',
    retailPrice: 45.00,
    wholesalePrice: 35.00,
    category: 'wholesale',
    productionHours: 8,
    emoji: '📦',
  },
  {
    id: '14',
    name: 'Baguette Box (20)',
    description: 'Box of 20 freshly baked French baguettes.',
    retailPrice: 32.00,
    wholesalePrice: 25.00,
    category: 'wholesale',
    productionHours: 4,
    emoji: '📦',
  },

  // SUNDRIES
  {
    id: '15',
    name: 'Clotted Cream (227g)',
    description: 'Premium Cornish clotted cream. Keep refrigerated.',
    retailPrice: 4.50,
    wholesalePrice: null,
    category: 'sundries',
    productionHours: 0,
    emoji: '🧈',
  },
  {
    id: '16',
    name: 'Strawberry Jam (340g)',
    description: 'Homemade strawberry jam with real fruit.',
    retailPrice: 3.50,
    wholesalePrice: null,
    category: 'sundries',
    productionHours: 0,
    emoji: '🍓',
  },
]

// ============================================
// Products Page - Slindon Patisserie
// ============================================

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showRetailPrices, setShowRetailPrices] = useState(true) // Toggle between retail/wholesale
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)

  // Handle add to cart
  const handleAddToCart = (product: typeof allProducts[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: showRetailPrices ? product.retailPrice : product.wholesalePrice || product.retailPrice,
      quantity: 1,
      productionTime: product.productionHours,
      category: product.category,
    })
    
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
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
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#D42426] text-white'
                  : 'bg-white text-[#5C4033] hover:bg-[#E8DDD0]'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-[#8B7D6B] mb-4" />
            <p className="text-[#8B7D6B] text-lg">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const displayPrice = showRetailPrices 
                ? product.retailPrice 
                : product.wholesalePrice || product.retailPrice
              const hasWholesale = product.wholesalePrice !== null
              const savings = hasWholesale 
                ? ((product.retailPrice - product.wholesalePrice) / product.retailPrice * 100).toFixed(0)
                : 0

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-[#FDF8F0] relative flex items-center justify-center">
                    <span className="text-6xl">{product.emoji}</span>
                    
                    {Number(savings) > 0 && !showRetailPrices && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-[#4A3728] text-white text-xs font-bold rounded">
                        Save {savings}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs bg-[#FDF8F0] text-[#5C4033] rounded mb-2 uppercase tracking-wide">
                      {categories.find(c => c.id === product.category)?.label || product.category}
                    </span>
                    
                    <h3 className="font-semibold text-[#2D1810] text-lg">{product.name}</h3>
                    <p className="text-sm text-[#5C4033] mt-1 line-clamp-2">{product.description}</p>
                    
                    {product.productionHours > 0 && (
                      <p className="text-xs text-[#8B7D6B] mt-2">
                        Ready in ~{product.productionHours}h
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
                        disabled={addedToCart === product.id}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          addedToCart === product.id
                            ? 'bg-green-500 text-white'
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
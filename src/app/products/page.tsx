'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Filter, ChevronDown } from 'lucide-react'

// Product categories
const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'catering', label: 'Catering' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'pos', label: 'POS & Supplies' },
  { id: 'sundries', label: 'Sundries' },
]

// Sample products - in production these would come from the database
const sampleProducts = [
  {
    id: '1',
    name: 'Butter Croissant',
    description: 'Flaky, buttery French croissant made with finest French butter.',
    price: 2.50,
    category: 'bakery',
    productionTime: '8 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '2',
    name: 'Pain au Chocolat',
    description: 'Classic French pastry with rich dark chocolate batons.',
    price: 2.80,
    category: 'bakery',
    productionTime: '8 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '3',
    name: 'Almond Croissant',
    description: 'Croissant filled with almond cream and topped with flaked almonds.',
    price: 3.20,
    category: 'bakery',
    productionTime: '10 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '4',
    name: 'Sourdough Boule',
    description: 'Rustic round loaf with a caramelized crust and tangy, open crumb.',
    price: 4.50,
    category: 'bakery',
    productionTime: '48 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '5',
    name: 'Mini Sandwich Selection',
    description: 'Assorted mini sandwiches. Perfect for events.',
    price: 15.00,
    category: 'catering',
    productionTime: '4 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '6',
    name: 'Cream Tea for Two',
    description: 'Two plain scones, clotted cream, strawberry jam, and loose leaf tea.',
    price: 12.00,
    category: 'catering',
    productionTime: '2 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '7',
    name: 'Large Croissant Box (30)',
    description: 'Box of 30 premium butter croissants. Bulk pricing.',
    price: 45.00,
    category: 'wholesale',
    productionTime: '8 hours',
    image: '/images/placeholder.svg',
  },
  {
    id: '8',
    name: 'Paper Bags (500)',
    description: 'Plain brown paper bags. Medium size.',
    price: 15.00,
    category: 'pos',
    productionTime: null,
    image: '/images/placeholder.svg',
  },
  {
    id: '9',
    name: 'Clotted Cream (227g)',
    description: 'Premium Cornish clotted cream.',
    price: 4.50,
    category: 'sundries',
    productionTime: null,
    image: '/images/placeholder.svg',
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const filteredProducts = sampleProducts.filter(
    (product) => selectedCategory === 'all' || product.category === selectedCategory
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const currentCategoryLabel = categories.find((c) => c.id === selectedCategory)?.label || 'All Products'

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      {/* Header */}
      <div className="bg-[#4A3728] text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm hover:text-[#C4A35A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#4A3728] mb-4">
            Our Products
          </h1>
          <p className="text-[#8B7D6B] text-lg">
            Fresh from our ovens every day. Order today and pick up at a time that suits you.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Category Dropdown (Mobile) */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#8B7D6B] rounded-lg text-[#4A3728]"
            >
              <Filter className="w-4 h-4" />
              {currentCategoryLabel}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#8B7D6B] rounded-lg shadow-lg z-10 min-w-[200px]">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setShowCategoryDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F5F0E6] ${
                      selectedCategory === category.id ? 'bg-[#F5F0E6] font-semibold' : ''
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Tabs (Desktop) */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#4A3728] text-white'
                    : 'bg-white text-[#4A3728] hover:bg-[#E8E0D4]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-[#8B7D6B] rounded-lg text-[#4A3728] cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-[#8B7D6B] mb-4" />
            <p className="text-[#8B7D6B] text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="aspect-square bg-[#F5F0E6] flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <span className="inline-block px-2 py-1 text-xs bg-[#F5F0E6] text-[#8B7D6B] rounded mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-[#2C1810] mb-2">{product.name}</h3>
                  <p className="text-sm text-[#8B7D6B] mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#4A3728]">
                      £{product.price.toFixed(2)}
                    </span>
                    {product.productionTime && (
                      <span className="text-xs text-[#8B7D6B]">
                        Ready in {product.productionTime}
                      </span>
                    )}
                  </div>
                  <button className="w-full mt-4 py-2 bg-[#8B5A2B] text-white rounded-lg hover:bg-[#6B4423] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-white rounded-lg p-6 border-l-4 border-[#C4A35A]">
          <h3 className="font-semibold text-[#4A3728] mb-2">Production Time Notice</h3>
          <p className="text-[#8B7D6B] text-sm">
            All our products are made fresh to order. When selecting your pickup time, please
            ensure you choose a time at least equal to the longest production time among your
            selected items. You'll see the minimum ready-by time at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
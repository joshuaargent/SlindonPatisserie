'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, ShoppingCart, ShoppingBag, Package, Loader2 } from 'lucide-react';

// Category display configuration
const categoryConfig: Record<string, { label: string; description: string; color: string; emoji: string }> = {
  bakery: { label: 'Patisserie', description: 'Croissants, Danish, Pain au Chocolat', color: 'bg-[#D42426]', emoji: '🥐' },
  bread: { label: 'Artisan Bread', description: 'Sourdough, Baguettes, Ciabatta', color: 'bg-[#8B5A2B]', emoji: '🍞' },
  catering: { label: 'Catering', description: 'Sandwiches, Platters, Afternoon Tea', color: 'bg-[#F5C518]', emoji: '🥪' },
  wholesale: { label: 'Wholesale', description: 'Bulk orders for your business', color: 'bg-[#4A3728]', emoji: '📦' },
  sundries: { label: 'Sundries', description: 'Jam, Cream, and more', color: 'bg-[#6B5B4F]', emoji: '🛒' },
}

// Market schedule
const markets = [
  { name: 'Camberley Market', day: 'Saturday', time: '9am - 2pm', highlight: true },
  { name: 'Arundel Market', day: 'Sunday', time: '9am - 1pm', highlight: false },
  { name: 'Ripley Market', day: 'Thursday', time: '9am - 1pm', highlight: false },
];

// ============================================
// Homepage - Dynamic from Database
// ============================================

export default function HomePage() {
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    retailPrice: number;
    category: string;
    image: string | null;
    available: boolean;
  }>>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?available=true&includeWholesale=true')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products.slice(0, 4)) // Featured: first 4 products
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Get category display info
  const getCategoryInfo = (category: string) => {
    return categoryConfig[category] || { label: category, description: '', color: 'bg-[#4A3728]', emoji: '🧁' }
  }

  // Get first 4 available categories for category cards
  const categoryCards = categories.slice(0, 4).map(cat => ({
    ...categoryConfig[cat],
    href: `/products?category=${cat}`,
  }))

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#D42426] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container py-16 md:py-24 lg:py-28 relative">
          <div className="max-w-3xl">
            <p className="text-[#F5C518] text-sm font-medium tracking-wider uppercase mb-4">
              Fresh From Our Ovens • Camberley
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Handmade Patisserie,<br />
              <span className="text-[#F5C518]">Delivered to You</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl">
              Order our award-winning croissants, breads, and pastries for collection or delivery.
              Same products, better prices for wholesale customers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-8 py-4 text-lg font-bold text-[#D42426] transition-all hover:bg-white hover:scale-105 shadow-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                Shop Now
              </Link>
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-4 text-base font-medium text-white transition-colors hover:bg-white hover:text-[#D42426]"
              >
                <MapPin className="h-5 w-5" />
                Visit Us at Markets
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L48 74C96 68 192 56 288 50C384 44 480 44 576 48C672 52 768 60 864 64C960 68 1056 68 1152 64C1248 60 1344 52 1392 48L1440 44V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#FDF8F0"/>
          </svg>
        </div>
      </section>

      {/* Category Cards - Shop by Type (Dynamic) */}
      <section className="py-16 md:py-20 bg-[#FDF8F0]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810]">
              Shop by Category
            </h2>
            <p className="mt-3 text-[#5C4033] max-w-2xl mx-auto">
              Browse our full range of freshly baked goods. Order today, pick up when ready.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#D42426] animate-spin" />
              <span className="ml-3 text-[#5C4033]">Loading...</span>
            </div>
          ) : categoryCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categoryCards.map((category, index) => (
                <Link
                  key={index}
                  href={category.href || '/products'}
                  className="group relative rounded-2xl overflow-hidden aspect-square md:aspect-auto md:h-48 p-6 flex flex-col justify-end transition-transform hover:scale-[1.02] shadow-md"
                  style={{ backgroundColor: category.color.includes('[') ? undefined : category.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="text-4xl relative z-10 mb-2">{category.emoji}</span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white relative z-10">
                    {category.label}
                  </h3>
                  <p className="text-sm text-white/80 relative z-10 mt-1">
                    {category.description}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#5C4033]">No categories available yet.</p>
          )}

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[#D42426] font-semibold hover:text-[#B81E20] transition-colors"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products (Dynamic) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810]">
                Popular Products
              </h2>
              <p className="mt-2 text-[#5C4033]">
                Our most-loved items, made fresh daily
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#D42426] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B81E20] transition-colors"
            >
              Shop All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#D42426] animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const categoryInfo = getCategoryInfo(product.category)
                return (
                  <div
                    key={product.id}
                    className="group bg-[#FDF8F0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-[#E8DDD0] relative flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">{categoryInfo.emoji}</span>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-[#8B7D6B] uppercase tracking-wide">{categoryInfo.label}</p>
                      <h3 className="font-semibold text-[#2D1810] mt-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-[#D42426]">£{product.retailPrice.toFixed(2)}</span>
                        <Link
                          href="/products"
                          className="text-sm text-[#4A3728] hover:text-[#D42426] font-medium"
                        >
                          Add to Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-[#5C4033] py-12">No products available yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Retail vs Wholesale Comparison */}
      <section className="py-16 md:py-20 bg-[#4A3728] text-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Shop Retail or Wholesale
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              The same great products, available to everyone. Wholesale customers get half-price bulk orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Retail */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-[#F5C518]" />
                <h3 className="font-serif text-2xl font-bold">Retail</h3>
              </div>
              <ul className="space-y-3 text-white/90 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span>
                  Individual items
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span>
                  Order for collection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span>
                  No account needed
                </li>
              </ul>
              <Link
                href="/products"
                className="block text-center bg-[#F5C518] text-[#4A3728] py-3 rounded-lg font-bold hover:bg-white transition-colors"
              >
                Shop Retail
              </Link>
            </div>

            {/* Wholesale */}
            <div className="bg-[#D42426]/20 backdrop-blur rounded-2xl p-8 border-2 border-[#D42426]">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-[#F5C518]" />
                <h3 className="font-serif text-2xl font-bold">Wholesale</h3>
                <span className="ml-auto px-2 py-1 bg-[#F5C518] text-[#4A3728] text-xs font-bold rounded">
                  50% OFF
                </span>
              </div>
              <ul className="space-y-3 text-white/90 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span>
                  Bulk orders (boxes of 20+)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span>
                  Half price on everything
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span>
                  Account required
                </li>
              </ul>
              <Link
                href="/wholesale"
                className="block text-center bg-[#D42426] text-white py-3 rounded-lg font-bold hover:bg-[#B81E20] transition-colors"
              >
                Apply for Wholesale
              </Link>
            </div>
          </div>

          <p className="text-center text-white/60 text-sm mt-8">
            Same products • Same quality • Better prices for businesses
          </p>
        </div>
      </section>

      {/* Visit Us at Markets */}
      <section className="py-16 md:py-20 bg-[#FDF8F0]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D42426]/10 text-[#D42426] rounded-full text-sm font-medium mb-4">
                <MapPin className="h-4 w-4" />
                Visit Us
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810] mb-4">
                Find Us at Local Markets
              </h2>
              <p className="text-[#5C4033] mb-6">
                Come and say hello! We're at markets across the area every week with our full range of freshly baked goods.
              </p>
              
              <div className="space-y-4">
                {markets.map((market, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${market.highlight ? 'bg-[#D42426]' : 'bg-[#4A3728]'}`}>
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2D1810]">{market.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-[#5C4033]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {market.day}
                        </span>
                        <span>{market.time}</span>
                      </div>
                    </div>
                    {market.highlight && (
                      <span className="px-2 py-1 bg-[#F5C518] text-[#4A3728] text-xs font-bold rounded">
                        This Week
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href="/markets"
                className="inline-flex items-center gap-2 mt-6 text-[#D42426] font-semibold hover:text-[#B81E20]"
              >
                View Full Market Schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Map placeholder */}
            <div className="bg-[#E8DDD0] rounded-2xl aspect-square md:aspect-[4/3] flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 text-[#4A3728] mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-[#4A3728]">Camberley, Surrey</h3>
                <p className="text-[#5C4033] mt-2">Find us every Saturday at the market</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#2D1810] text-white">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Browse our full range, add items to your cart, and select a pickup time.
            Payment is collected when you collect your order.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#F5C518] text-[#2D1810] px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white px-6 py-4 rounded-lg font-medium hover:bg-white hover:text-[#2D1810] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
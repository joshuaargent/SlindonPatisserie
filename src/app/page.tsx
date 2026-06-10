'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, ShoppingCart, Loader2 } from 'lucide-react';

// Category display configuration - French Patisserie style
const categoryConfig: Record<string, { label: string; description: string; color: string; bgColor: string; emoji: string }> = {
  bakery: { label: 'Pâtisserie', description: 'Croissants, Danish, Pain au Chocolat', color: 'text-white', bgColor: 'bg-[#D42426]', emoji: '🥐' },
  bread: { label: 'Pain Artisanal', description: 'Sourdough, Baguettes, Ciabatta', color: 'text-white', bgColor: 'bg-[#A81B1D]', emoji: '🍞' },
  catering: { label: 'Traiteur', description: 'Sandwiches, Platters, Afternoon Tea', color: 'text-[#2C1810]', bgColor: 'bg-[#F5C518]', emoji: '🥪' },
  wholesale: { label: 'Wholesale', description: 'Bulk orders for your business', color: 'text-white', bgColor: 'bg-[#5C4033]', emoji: '📦' },
  sundries: { label: 'Épicerie', description: 'Jam, Cream, and more', color: 'text-white', bgColor: 'bg-[#8B7355]', emoji: '🛒' },
}

// Market schedule
const markets = [
  { name: 'Camberley Market', day: 'Saturday', time: '9am - 2pm', highlight: true },
  { name: 'Arundel Market', day: 'Sunday', time: '9am - 1pm', highlight: false },
  { name: 'Ripley Market', day: 'Thursday', time: '9am - 1pm', highlight: false },
];

// ============================================
// Homepage - Slindon Patisserie
// Old School French Patisserie Style (Ratatouille)
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
          setProducts(data.products.slice(0, 4))
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

  const getCategoryInfo = (category: string) => {
    return categoryConfig[category] || { label: category, description: '', color: 'text-white', bgColor: 'bg-[#5C4033]', emoji: '🧁' }
  }

  const categoryCards = categories.slice(0, 4).map(cat => ({
    ...categoryConfig[cat],
    href: `/products?category=${cat}`,
  }))

  return (
    <>
      {/* Hero Section - Classic French Red with Script Font */}
      <section className="relative bg-[#D42426] text-white overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="french-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white"/>
            </pattern>
            <rect fill="url(#french-pattern)" width="100%" height="100%"/>
          </svg>
        </div>
        
        <div className="container py-12 md:py-16 lg:py-20 relative">
          {/* Script header */}
          <p className="font-script text-2xl md:text-3xl text-[#F5C518] mb-2 animate-gentle-bounce">
            Bienvenue
          </p>
          
          {/* Main heading - Serif for elegance */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Slindon<br />
            <span className="text-[#F5C518]">Patisserie</span>
          </h1>
          
          {/* Script tagline */}
          <p className="font-dancing text-xl md:text-2xl text-white/90 mb-6 max-w-lg">
            Handmade French Patisserie Since 1740
          </p>
          
          <p className="text-white/80 text-lg max-w-xl mb-8">
            For over 40 years, we've been crafting traditional French patisserie 
            using the finest ingredients and time-honored recipes.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#F5C518] text-[#D42426] px-8 py-4 text-lg font-bold rounded-lg transition-all hover:bg-white hover:scale-105 shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              Commander
            </Link>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 border-2 border-white px-6 py-4 text-base font-medium rounded-lg transition-colors hover:bg-white hover:text-[#D42426]"
            >
              <MapPin className="h-5 w-5" />
              Nous Trouver
            </Link>
          </div>
        </div>

        {/* Decorative Wave - French flag colors */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60L60 50C120 40 240 20 360 20C480 20 600 40 720 50C840 60 960 60 1080 55C1200 50 1320 40 1380 35L1440 30V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* Category Cards - French Patisserie Style */}
      <section className="py-12 md:py-16 bg-[#FFF8E7]">
        <div className="container">
          {/* Section header with French script */}
          <div className="text-center mb-10">
            <p className="font-script text-2xl text-[#D42426] mb-1">Nos Produits</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1810]">
              Shop by Category
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#D42426] animate-spin" />
            </div>
          ) : categoryCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryCards.map((category, index) => (
                <Link
                  key={index}
                  href={category.href || '/products'}
                  className={`${category.bgColor} ${category.color} rounded-xl p-6 flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-lg`}
                >
                  <span className="text-5xl mb-3">{category.emoji}</span>
                  <h3 className="font-serif text-xl font-bold mb-1">{category.label}</h3>
                  <p className="text-sm opacity-80">{category.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#5C4033]">Loading products...</p>
          )}

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[#D42426] font-bold hover:text-[#A81B1D] transition-colors font-serif text-lg"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - French Menu Style */}
      <section className="py-12 md:py-16 bg-[#FFFDF5]">
        <div className="container">
          <div className="text-center mb-10">
            <p className="font-script text-2xl text-[#D42426] mb-1">Les Plus Populaires</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1810]">
              Popular Products
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#D42426] animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => {
                const categoryInfo = getCategoryInfo(product.category)
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-[#FFF8E7] to-[#F5E6D3] relative flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform">{categoryInfo.emoji}</span>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-[#8B7355] uppercase tracking-wider font-serif">{categoryInfo.label}</p>
                      <h3 className="font-serif font-bold text-[#2C1810] text-lg mt-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-serif text-xl font-bold text-[#D42426]">£{product.retailPrice.toFixed(2)}</span>
                        <Link
                          href="/products"
                          className="bg-[#F5C518] text-[#2C1810] px-3 py-1 rounded-full text-sm font-bold hover:bg-[#D4A000] transition-colors"
                        >
                          Add
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-[#5C4033] py-12">No products available yet.</p>
          )}

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#D42426] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#A81B1D] transition-colors"
            >
              Shop All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Retail vs Wholesale - French Bistro Style */}
      <section className="py-12 md:py-16 bg-[#5C4033] text-white">
        <div className="container">
          <div className="text-center mb-10">
            <p className="font-script text-2xl text-[#F5C518] mb-1">Commander</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Retail or Wholesale
            </h2>
            <p className="text-white/80 mt-2 max-w-xl mx-auto">
              The same great French patisserie, available to everyone. 
              Wholesale customers receive 50% off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Retail */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border-2 border-white/20">
              <div className="text-center mb-6">
                <span className="text-5xl mb-4 block">🛒</span>
                <h3 className="font-serif text-2xl font-bold">Retail</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span> Individual items
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span> Order for collection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span> No account needed
                </li>
              </ul>
              <Link
                href="/products"
                className="block text-center bg-[#F5C518] text-[#2C1810] py-3 rounded-lg font-bold hover:bg-white transition-colors"
              >
                Shop Retail
              </Link>
            </div>

            {/* Wholesale */}
            <div className="bg-[#D42426] rounded-2xl p-8 border-4 border-[#F5C518]">
              <div className="text-center mb-4">
                <span className="text-5xl mb-4 block">📦</span>
                <h3 className="font-serif text-2xl font-bold">Wholesale</h3>
                <span className="inline-block mt-2 px-3 py-1 bg-[#F5C518] text-[#2C1810] text-sm font-bold rounded-full">
                  50% OFF
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span> Bulk orders (20+)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span> Half price everything
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F5C518]">✓</span> Business account required
                </li>
              </ul>
              <Link
                href="/wholesale"
                className="block text-center bg-white text-[#D42426] py-3 rounded-lg font-bold hover:bg-[#F5C518] transition-colors"
              >
                Apply for Wholesale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us - French Market Style */}
      <section className="py-12 md:py-16 bg-[#FFF8E7]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-script text-2xl text-[#D42426] mb-1">Nous Trouver</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C1810] mb-4">
                Visit Us at the Markets
              </h2>
              <p className="text-[#5C4033] mb-6">
                Come and taste our authentic French patisserie at local markets across Surrey and West Sussex.
              </p>
              
              <div className="space-y-4">
                {markets.map((market, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${market.highlight ? 'bg-[#D42426]' : 'bg-[#5C4033]'}`}>
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-[#2C1810]">{market.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-[#5C4033]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {market.day}
                        </span>
                        <span>{market.time}</span>
                      </div>
                    </div>
                    {market.highlight && (
                      <span className="px-3 py-1 bg-[#F5C518] text-[#2C1810] text-sm font-bold rounded-full">
                        This Week
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href="/markets"
                className="inline-flex items-center gap-2 mt-6 text-[#D42426] font-bold hover:text-[#A81B1D] font-serif"
              >
                View Full Schedule
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Decorative illustration */}
            <div className="bg-gradient-to-br from-[#D42426] to-[#A81B1D] rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center p-8 text-white">
                <span className="text-8xl mb-4 block">🥐</span>
                <p className="font-script text-3xl">Fait Maison</p>
                <p className="font-serif text-lg mt-2 opacity-80">Handmade with love</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[#2C1810] text-white">
        <div className="container text-center">
          <p className="font-script text-2xl text-[#F5C518] mb-2">Prêt à Commander?</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Browse our full range of authentic French patisserie, add items to your cart, 
            and select a pickup time. Payment is collected when you collect your order.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#F5C518] text-[#2C1810] px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white px-6 py-4 rounded-lg font-medium hover:bg-white hover:text-[#2C1810] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
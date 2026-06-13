import Link from 'next/link';
import { ArrowRight, MapPin, ShoppingBag, Clock, Phone, MessageCircle, ChevronDown, Star } from 'lucide-react';
import { businessInfo, marketSchedule } from '@/data/site';

// ============================================
// Homepage - Slindon Patisserie
// Optimized for Online Ordering & Camberley Collection
// ============================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Heritage Bakery Style */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/image00006.jpeg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E22]/95 via-[#8B1E22]/85 to-transparent" />
        
        {/* Hero Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#D0A246]/20 text-[#D0A246] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#D0A246]/30">
              <span className="h-2 w-2 rounded-full bg-[#D0A246] animate-pulse" />
              Order Online • Pay via Teya • Collect in Camberley
            </div>
            
            {/* Main Headline */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Freshly Baked,
              <br />
              <span className="text-[#D0A246]">Crafted with Love</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 leading-relaxed">
              Handmade patisserie crafted fresh daily in Camberley. Order online, 
              pay securely through Teya, and collect your freshly baked goods at our bakery.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-[#D0A246] hover:bg-[#E0B256] px-8 py-4 text-lg font-semibold text-[#3A2C2A] rounded-xl transition-all duration-200 shadow-lg shadow-[#D0A246]/20 hover:shadow-xl hover:shadow-[#D0A246]/30 hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-5 w-5" />
                Order Online Now
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 px-6 py-4 text-lg font-medium text-white rounded-xl transition-all duration-200 hover:bg-white/10"
              >
                How It Works
                <ChevronDown className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-[#D0A246]/30 border-2 border-white/20 flex items-center justify-center text-xs">⭐</div>
                  ))}
                </div>
                <span>4.9/5 from 200+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Same-day pickup available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F7F2E9"/>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[#D0A246] text-sm font-semibold tracking-wider uppercase mb-3">Simple & Convenient</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A2C2A] mb-4">
              How to Order
            </h2>
            <p className="text-[#8B1E22] max-w-2xl mx-auto text-lg">
              Ordering your favorite patisserie has never been easier. 
              Three simple steps to fresh baked goods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="h-20 w-20 rounded-2xl bg-[#8B1E22] mx-auto mb-6 flex items-center justify-center text-[#D0A246] text-3xl font-serif font-bold shadow-lg shadow-[#8B1E22]/20 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-3">Browse & Select</h3>
              <p className="text-[#8B1E22]">
                Choose from our range of freshly baked pastries, breads, cakes, and seasonal specials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="h-20 w-20 rounded-2xl bg-[#8B1E22] mx-auto mb-6 flex items-center justify-center text-[#D0A246] text-3xl font-serif font-bold shadow-lg shadow-[#8B1E22]/20 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-3">Pay Securely</h3>
              <p className="text-[#8B1E22]">
                Complete your payment securely through Teya. Pay by card, Apple Pay, or Google Pay.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="h-20 w-20 rounded-2xl bg-[#8B1E22] mx-auto mb-6 flex items-center justify-center text-[#D0A246] text-3xl font-serif font-bold shadow-lg shadow-[#8B1E22]/20 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-3">Collect Fresh</h3>
              <p className="text-[#8B1E22]">
                Pick up your order from our Camberley bakery at your selected time. Pay nothing extra!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Info Section */}
      <section className="py-16 md:py-20 bg-[#FDFBF7]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#8B1E22]/10 text-[#8B1E22] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <MapPin className="h-4 w-4" />
                Collection Point
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-6">
                Collect Your Order in <span className="text-[#D0A246]">Camberley</span>
              </h2>
              <div className="space-y-4 text-[#8B1E22] mb-8">
                <p className="text-lg">
                  Once your order is confirmed and paid, head to our Camberley location to collect your 
                  freshly baked goods at your chosen time slot.
                </p>
                <div className="bg-[#F7F2E9] rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-[#8B1E22]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3A2C2A]">Camberley Collection</h4>
                      <p className="text-[#8B1E22]">Full address will be provided in your order confirmation email.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F7F2E9] rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-[#8B1E22]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3A2C2A]">Collection Hours</h4>
                      <p className="text-[#8B1E22]">Mon-Sat: 9:00 AM - 5:00 PM</p>
                      <p className="text-[#8B1E22]">Select your preferred pickup time at checkout</p>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#8B1E22] hover:bg-[#9B2A32] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Your Order
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Delivery Inquiry Card */}
            <div className="bg-gradient-to-br from-[#8B1E22] to-[#9B2A32] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-[#D0A246]/20 flex items-center justify-center">
                  <MessageCircle className="h-7 w-7 text-[#D0A246]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold">Delivery Available</h3>
                  <p className="text-white/70">By arrangement</p>
                </div>
              </div>
              <p className="text-white/90 mb-6">
                Need your order delivered? We offer delivery by arrangement for local orders. 
                Contact us to discuss delivery options and availability.
              </p>
              <div className="space-y-3">
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl transition-colors"
                >
                  <Phone className="h-5 w-5 text-[#D0A246]" />
                  <span>{businessInfo.phone}</span>
                </a>
                <Link
                  href="/contact?type=delivery"
                  className="flex items-center gap-3 bg-[#D0A246] hover:bg-[#E0B256] text-[#3A2C2A] px-5 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">Enquire About Delivery</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-[#D0A246] text-sm font-semibold tracking-wider uppercase mb-2">Fresh Daily</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
                Our Signature Bakes
              </h2>
              <p className="mt-2 text-[#8B1E22] max-w-xl">
                Handmade using traditional recipes and the finest ingredients. 
                Every item crafted with care.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[#8B1E22] font-medium hover:text-[#D0A246] transition-colors"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Croissants', emoji: '🥐', desc: 'Buttery, flaky perfection' },
              { name: 'Breads', emoji: '🍞', desc: 'Artisan loaves, fresh daily' },
              { name: 'Cakes', emoji: '🎂', desc: 'Decadent & delicious' },
              { name: 'Pastries', emoji: '🥐', desc: 'Sweet & savory varieties' },
              { name: 'Sourdough', emoji: '🍞', desc: 'Rustic & tangy' },
              { name: 'Cookies', emoji: '🍪', desc: 'Crispy & chewy options' },
              { name: 'Seasonal', emoji: '🎄', desc: 'Limited edition treats' },
              { name: 'Catering', emoji: '🎉', desc: 'Party platters & more' },
            ].map((category, index) => (
              <Link
                key={index}
                href="/products"
                className="group bg-white rounded-2xl p-6 border border-[#E8DDD0] hover:border-[#D0A246] hover:shadow-lg transition-all duration-200"
              >
                <span className="text-4xl mb-3 block">{category.emoji}</span>
                <h3 className="font-semibold text-[#3A2C2A] group-hover:text-[#8B1E22] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-[#6B5344] mt-1">{category.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Markets */}
      <section className="py-16 md:py-24 bg-[#FDFBF7]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-[#D0A246] text-sm font-semibold tracking-wider uppercase mb-2">Or Visit Us</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
                Find Us at Markets
              </h2>
              <p className="mt-2 text-[#8B1E22]">
                Prefer to browse in person? We attend several farmers markets weekly.
              </p>
            </div>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 text-[#8B1E22] font-medium hover:text-[#D0A246] transition-colors"
            >
              View Full Schedule
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketSchedule.slice(0, 4).map((market, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-5 border border-[#E8DDD0] hover:border-[#D0A246] transition-colors"
              >
                <h3 className="font-serif text-lg font-bold text-[#3A2C2A]">{market.name}</h3>
                <p className="text-[#D0A246] text-sm font-medium mt-1">{market.day}</p>
                <p className="text-[#8B1E22] text-sm mt-2">{market.location}</p>
                <p className="text-[#6B5344] text-sm mt-1">{market.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-16 md:py-20 bg-[#8B1E22]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Wholesale & Trade?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              We supply cafes, hotels, restaurants, and shops across the region. 
              Get competitive wholesale pricing with a dedicated account.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 bg-[#D0A246] text-[#3A2C2A] px-8 py-4 rounded-lg font-semibold hover:bg-[#E0B256] transition-colors"
              >
                Wholesale Enquiry
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Login for Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D0A246] text-sm font-semibold tracking-wider uppercase mb-3">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-6">
                Traditional Baking, <br />Modern Convenience
              </h2>
              <div className="space-y-4 text-[#8B1E22]">
                <p className="text-lg">
                  For over 40 years, Slindon Patisserie has been crafting handmade bakery products 
                  using recipes passed down through generations.
                </p>
                <p>
                  Located in the heart of the South Downs National Park, we supply local markets 
                  and now online customers with freshly baked goods every single day.
                </p>
                <p>
                  Our commitment to quality means we use only the finest ingredients - from locally 
                  sourced flour to free-range eggs and European butter. Every product that leaves our 
                  ovens is a testament to the art of traditional baking.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-[#8B1E22] font-medium hover:text-[#D0A246] transition-colors"
              >
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* About Image Placeholder */}
            <div className="bg-gradient-to-br from-[#8B1E22]/10 to-[#D0A246]/10 rounded-3xl aspect-square flex items-center justify-center border-2 border-dashed border-[#D0A246]/30">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🥐</div>
                <h3 className="font-serif text-xl font-bold text-[#8B1E22]">Slindon Patisserie</h3>
                <p className="text-[#6B5344] mt-2">40+ Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-[#3A2C2A] text-white">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Whether you have a question about ordering, delivery, or our products, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center gap-2 bg-[#D0A246] text-[#3A2C2A] px-8 py-4 rounded-lg font-bold hover:bg-[#E0B256] transition-colors"
            >
              <Phone className="h-5 w-5" />
              Call Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/30 px-6 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

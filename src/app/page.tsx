import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Phone, Users, DollarSign, TrendingUp, Clock, MapPin, CheckCircle, Star, Heart, Award, Truck } from 'lucide-react';
import { businessInfo, marketSchedule } from '@/data/site';

// ============================================
// Homepage - Slindon Patisserie
// Conversion-Focused: Products, Wholesale, Franchise
// ============================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Clean, Conversion Focused */}
      <section className="relative bg-[#8B1E22] overflow-hidden">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content - Left Side */}
            <div className="relative z-10">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Star className="h-4 w-4 text-[#D0A246] fill-[#D0A246]" />
                Trusted by 200+ customers • 40+ years of excellence
              </div>
              
              {/* Main Headline */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Handmade Patisserie,
                <br />
                <span className="text-[#D0A246]">Baked Fresh Daily</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/85 max-w-xl mb-8 leading-relaxed">
                Order online, pay via Teya, collect in Camberley. Or partner with us — wholesale & franchise opportunities available.
              </p>
              
              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/products"
                  className="btn-primary text-lg px-8 py-4 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Order Online Now
                </Link>
                <Link
                  href="#franchise"
                  className="btn-outline-white text-lg px-6 py-4"
                >
                  <DollarSign className="h-5 w-5" />
                  Franchise Opportunity
                </Link>
              </div>
              
              {/* Quick Benefits */}
              <div className="flex flex-wrap gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D0A246]" />
                  <span>Pay via Teya (Secure)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D0A246]" />
                  <span>Same-day Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#D0A246]" />
                  <span>Camberley Collection</span>
                </div>
              </div>
            </div>
            
            {/* Owner Photo - Right Side */}
            <div className="relative">
              <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                <Image
                  src="/images/bakery-owner.jpg"
                  alt="Slindon Patisserie owner serving a happy customer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-[#8B1E22]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#3A2C2A]">Family Owned</p>
                    <p className="text-sm text-[#6B5344]">40+ Years in Business</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#F7F2E9"/>
          </svg>
        </div>
      </section>

      {/* Quick Order Section */}
      <section className="py-16 md:py-20 bg-[#F7F2E9]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Online Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DDD0] hover:shadow-lg hover:border-[#D0A246] transition-all">
              <div className="h-14 w-14 rounded-2xl bg-[#D0A246]/20 flex items-center justify-center mb-6">
                <ShoppingBag className="h-7 w-7 text-[#8B1E22]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-3">Order Online</h3>
              <p className="text-[#6B5344] mb-6">
                Browse our full range and order for collection in Camberley. Pay securely via Teya.
              </p>
              <Link
                href="/products"
                className="btn-secondary"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Wholesale Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DDD0] hover:shadow-lg hover:border-[#D0A246] transition-all">
              <div className="h-14 w-14 rounded-2xl bg-[#8B1E22]/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-[#8B1E22]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-3">Wholesale</h3>
              <p className="text-[#6B5344] mb-6">
                Supply your cafe, shop, or restaurant with our award-winning patisserie.
              </p>
              <Link
                href="/wholesale"
                className="btn-primary"
              >
                Get Wholesale Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Franchise Card */}
            <div className="bg-gradient-to-br from-[#8B1E22] to-[#9B2A32] rounded-2xl p-8 text-white shadow-lg">
              <div className="h-14 w-14 rounded-2xl bg-[#D0A246]/20 flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-[#D0A246]" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Franchise</h3>
              <p className="text-white/80 mb-6">
                Own your own Slindon Patisserie. Full training, proven systems, big potential.
              </p>
              <Link
                href="/franchise"
                className="btn-primary"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                      <p className="text-[#8B1E22]">Full address provided in order confirmation.</p>
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
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/products"
                className="btn-secondary"
              >
                Start Your Order
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Delivery Inquiry Card */}
            <div className="bg-gradient-to-br from-[#8B1E22] to-[#9B2A32] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-[#D0A246]/20 flex items-center justify-center">
                  <Truck className="h-7 w-7 text-[#D0A246]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold">Delivery Available</h3>
                  <p className="text-white/70">By arrangement</p>
                </div>
              </div>
              <p className="text-white/90 mb-6">
                Need your order delivered? We offer delivery by arrangement for local orders. 
                Contact us to discuss options.
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
                  className="btn-primary"
                >
                  <ArrowRight className="h-5 w-5" />
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

      {/* About / Owner Section */}
      <section id="about" className="py-16 md:py-24 bg-[#FDFBF7]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Owner Photo */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/bakery-owner.jpg"
                  alt="Slindon Patisserie owner with customer"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Stats Badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#8B1E22] text-white rounded-xl shadow-lg px-6 py-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-[#D0A246]" />
                  <div>
                    <p className="font-bold text-lg">40+ Years</p>
                    <p className="text-white/80 text-sm">of Excellence</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[#D0A246] text-sm font-semibold tracking-wider uppercase mb-3">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-6">
                Family Tradition,<br />
                <span className="text-[#8B1E22]">Baked with Heart</span>
              </h2>
              <div className="space-y-4 text-[#6B5344]">
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
                  sourced flour to free-range eggs and European butter.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/about"
                  className="btn-secondary"
                >
                  Our Full Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="btn-primary"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise Highlight Section */}
      <section id="franchise" className="py-16 md:py-20 bg-[#8B1E22]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D0A246]/20 text-[#D0A246] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <DollarSign className="h-4 w-4" />
                Franchise Opportunity
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Own Your Own<br />
                <span className="text-[#D0A246]">Slindon Patisserie</span>
              </h2>
              <p className="text-white/85 text-lg mb-8">
                Join our proven business model with full training, ongoing support, and the power of a recognized heritage brand. This is a significant opportunity for the right partner.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/franchise"
                  className="btn-primary px-8 py-4"
                >
                  Learn About Franchising
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/contact?type=franchise"
                  className="btn-outline-white px-6 py-4"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'Full Training', desc: 'Complete operational guidance' },
                { icon: TrendingUp, label: 'Proven Systems', desc: '40+ years of best practices' },
                { icon: Award, label: 'Brand Recognition', desc: 'Trusted heritage reputation' },
                { icon: Heart, label: 'Ongoing Support', desc: 'Dedicated partner support' },
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <item.icon className="h-8 w-8 text-[#D0A246] mb-3" />
                  <h3 className="font-bold text-white mb-1">{item.label}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section - Simplified */}
      <section className="py-16 md:py-20 bg-[#F7F2E9]">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-[#D0A246] text-sm font-semibold tracking-wider uppercase mb-2">Find Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-4">
              Visit Us at Local Markets
            </h2>
            <p className="text-[#6B5344] max-w-xl mx-auto">
              Come meet us in person and try our products before you order online.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {marketSchedule.slice(0, 4).map((market, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-[#E8DDD0] hover:border-[#D0A246] hover:shadow-lg transition-all"
              >
                <h3 className="font-serif text-lg font-bold text-[#3A2C2A]">{market.name}</h3>
                <p className="text-[#D0A246] text-sm font-medium mt-1">{market.day}</p>
                <p className="text-[#6B5344] text-sm mt-2">{market.location}</p>
                <p className="text-[#8B1E22] text-sm mt-1">{market.time}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 text-[#8B1E22] font-medium hover:text-[#D0A246] transition-colors"
            >
              View Full Market Schedule
              <ArrowRight className="h-4 w-4" />
            </Link>
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
              className="btn-primary px-8 py-4"
            >
              <Phone className="h-5 w-5" />
              Call Us
            </a>
            <Link
              href="/contact"
              className="btn-outline-white px-6 py-4"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

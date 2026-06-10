import Link from 'next/link';
import { ArrowRight, MapPin, ShoppingBag, Users, Building2, Clock, Star } from 'lucide-react';
import { businessInfo, marketSchedule } from '@/data/site';

// ============================================
// Homepage - Slindon Patisserie
// Old School French Patisserie / Disneyland Style
// ============================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Classic Disneyland style with swishy fonts */}
      <section className="relative bg-[#D42426] text-white overflow-hidden">
        {/* Background pattern - subtle checkered/harlequin */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container py-16 md:py-24 lg:py-32 relative">
          <div className="max-w-3xl">
            {/* Subtitle with handwritten style */}
            <p className="font-handwritten text-[#F5C518] text-xl md:text-2xl mb-4">
              ~ Handmade with love since 1740 ~
            </p>
            
            {/* Main heading with script font */}
            <h1 className="font-script text-5xl md:text-6xl lg:text-7xl font-normal leading-tight mb-6 text-white">
              Slindon<br />
              <span className="text-[#F5C518]">Patisserie</span>
            </h1>
            
            <p className="text-lg text-white/90 max-w-xl mb-8">
              Traditional French-style patisserie crafted with passion. 
              Find us at local markets or order for collection.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-8 py-4 text-lg font-bold text-[#D42426] transition-all hover:bg-white hover:scale-105 shadow-lg"
              >
                <MapPin className="h-5 w-5" />
                Find Us at Markets
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-4 text-base font-medium text-white transition-colors hover:bg-white hover:text-[#D42426]"
              >
                <Building2 className="h-5 w-5" />
                Wholesale
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Wave - classic bakery sign style */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="#FFF8E7"/>
          </svg>
        </div>
      </section>

      {/* Who Are You Section - Three Segments */}
      <section className="py-16 md:py-24 bg-[#FFF8E7]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-script text-4xl md:text-5xl text-[#D42426] mb-4">
              Comment pouvons-nous vous aider?
            </h2>
            <p className="text-[#5C4033] max-w-2xl mx-auto">
              Whether you&apos;re looking for fresh treats at the market, stocking your business,
              or exploring franchise opportunities - we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Retail */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-[#D42426]">
              <div className="h-16 w-16 rounded-full bg-[#D42426]/10 flex items-center justify-center mb-6">
                <ShoppingBag className="h-8 w-8 text-[#D42426]" />
              </div>
              <h3 className="font-script text-3xl text-[#D42426] mb-3">Retail</h3>
              <p className="text-[#5C4033] mb-6">
                Visit us at one of our weekly farmers markets. Fresh bread, pastries, cakes,
                and seasonal specials - all handmade with love.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <MapPin className="h-4 w-4 text-[#F5C518]" />
                  Arundel, Shoreham, Ripley, Camberley
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Clock className="h-4 w-4 text-[#F5C518]" />
                  Weekly markets, 9am - 1pm
                </li>
              </ul>
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 text-[#D42426] font-semibold hover:text-[#B81E20] transition-colors"
              >
                View Market Schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Wholesale */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-[#F5C518]">
              <div className="h-16 w-16 rounded-full bg-[#F5C518]/20 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-[#F5C518]" />
              </div>
              <h3 className="font-script text-3xl text-[#5C4033] mb-3">Wholesale</h3>
              <p className="text-[#5C4033] mb-6">
                Stock your cafe, shop, or business with our award-winning patisserie products.
                Competitive wholesale pricing available.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Star className="h-4 w-4 text-[#F5C518]" />
                  Cafes & coffee shops
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Star className="h-4 w-4 text-[#F5C518]" />
                  Hotels & restaurants
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Star className="h-4 w-4 text-[#F5C518]" />
                  Offices & corporate
                </li>
              </ul>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 text-[#5C4033] font-semibold hover:text-[#D42426] transition-colors"
              >
                Wholesale Enquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Franchise */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-[#D42426]">
              <div className="h-16 w-16 rounded-full bg-[#D42426]/10 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#D42426]" />
              </div>
              <h3 className="font-script text-3xl text-[#D42426] mb-3">Franchise</h3>
              <p className="text-[#5C4033] mb-6">
                Join our growing family! We offer a complete &quot;biz in a box&quot; franchise model
                with training, support, and proven systems.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Star className="h-4 w-4 text-[#F5C518]" />
                  Full training provided
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Star className="h-4 w-4 text-[#F5C518]" />
                  Marketing support
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Star className="h-4 w-4 text-[#F5C518]" />
                  Supply chain included
                </li>
              </ul>
              <Link
                href="/franchise"
                className="inline-flex items-center gap-2 text-[#D42426] font-semibold hover:text-[#B81E20] transition-colors"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Markets */}
      <section className="py-16 md:py-24 bg-[#F5C518]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="font-handwritten text-[#D42426] text-xl mb-2">~ This Week ~</p>
              <h2 className="font-script text-4xl md:text-5xl text-[#2D1810]">
                Find Us at Market
              </h2>
            </div>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 text-[#D42426] font-semibold hover:text-[#B81E20] transition-colors"
            >
              View Full Schedule
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketSchedule.slice(0, 3).map((market, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 border-2 border-[#D42426] shadow-md"
              >
                <h3 className="font-serif text-xl font-bold text-[#2D1810]">{market.name}</h3>
                <p className="text-[#D42426] text-sm font-semibold mt-1">{market.day}</p>
                <p className="text-[#5C4033] text-sm mt-2">{market.location}</p>
                <p className="text-[#6B5B4F] text-sm mt-1">{market.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-[#FFF8E7]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-handwritten text-[#D42426] text-xl mb-2">~ Our Story ~</p>
              <h2 className="font-script text-4xl md:text-5xl text-[#D42426] mb-6">
                About Slindon
              </h2>
              <div className="space-y-4 text-[#5C4033]">
                <p>
                  For over 40 years, Slindon Patisserie has been crafting traditional handmade bakery products
                  using recipes passed down through generations. Located in the heart of the South Downs,
                  we supply local markets and businesses with freshly baked goods every day.
                </p>
                <p>
                  Our commitment to quality means we use only the finest ingredients - from locally sourced
                  flour to free-range eggs and European butter. Every product that leaves our ovens is a
                  testament to the art of traditional baking.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-[#D42426] font-semibold hover:text-[#B81E20] transition-colors"
              >
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-[#D42426] rounded-2xl aspect-video flex items-center justify-center p-8">
              <div className="text-center">
                <p className="font-script text-4xl text-white mb-4">{businessInfo.name}</p>
                <p className="text-white/80">{businessInfo.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA - Classic Disneyland style */}
      <section className="py-16 md:py-20 bg-[#D42426] text-white">
        <div className="container text-center">
          <p className="font-handwritten text-[#F5C518] text-xl mb-4">~ Nous rejoindre ~</p>
          <h2 className="font-script text-4xl md:text-5xl mb-4">
            Get in Touch
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Have a question about our products or services? We&apos;d love to hear from you.
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#F5C518] text-[#D42426] px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-2 border-white px-6 py-4 rounded-lg font-medium hover:bg-white hover:text-[#D42426] transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import { ArrowRight, MapPin, ShoppingBag, Users, Building2, Clock, Star, Phone } from 'lucide-react';
import { businessInfo, marketSchedule } from '@/data/site';

// ============================================
// Homepage - Slindon Patisserie
// Old School Bakery Style
// ============================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Classic bakery style */}
      <section className="relative bg-[#8B4513] text-white">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-[#F5C518] text-sm font-medium tracking-wider uppercase mb-4">
              Handmade Patisserie Since 1740
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Traditional Bakery,<br />
              <span className="text-[#F5C518]">Modern Convenience</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl">
              For over 40 years, we have been crafting handmade patisserie products using traditional recipes
              and the finest ingredients. Find us at local markets or order for collection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-6 py-3 text-base font-medium text-[#8B4513] transition-colors hover:bg-[#E8A818]"
              >
                <MapPin className="h-5 w-5" />
                Find Us at Markets
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-[#8B4513]"
              >
                <Building2 className="h-5 w-5" />
                Wholesale Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810]">
              How Can We Help You?
            </h2>
            <p className="mt-4 text-[#5C4033] max-w-2xl mx-auto">
              Whether you are looking for fresh treats at the market, stocking your business,
              or exploring franchise opportunities - we have got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Retail */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-[#E8DDD0]">
              <div className="h-16 w-16 rounded-full bg-[#D4A574]/20 flex items-center justify-center mb-6">
                <ShoppingBag className="h-8 w-8 text-[#8B4513]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2D1810] mb-3">Retail Customers</h3>
              <p className="text-[#5C4033] mb-6">
                Visit us at one of our weekly farmers markets. Fresh bread, pastries, cakes,
                and seasonal specials - all handmade with love.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <MapPin className="h-4 w-4 text-[#D4A574]" />
                  Arundel, Shoreham, Ripley, Camberley
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <Clock className="h-4 w-4 text-[#D4A574]" />
                  Weekly markets, 9am - 1pm
                </li>
              </ul>
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 text-[#8B4513] font-medium hover:text-[#6B3410] transition-colors"
              >
                View Market Schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Wholesale */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-[#E8DDD0]">
              <div className="h-16 w-16 rounded-full bg-[#D4A574]/20 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-[#8B4513]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2D1810] mb-3">Wholesale</h3>
              <p className="text-[#5C4033] mb-6">
                Stock your cafe, shop, or business with our award-winning patisserie products.
                Competitive wholesale pricing available.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Cafes and coffee shops
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Hotels and restaurants
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Offices and corporate
                </li>
              </ul>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 text-[#8B4513] font-medium hover:text-[#6B3410] transition-colors"
              >
                Wholesale Enquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Franchise */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-[#E8DDD0]">
              <div className="h-16 w-16 rounded-full bg-[#D4A574]/20 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#8B4513]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2D1810] mb-3">Franchise</h3>
              <p className="text-[#5C4033] mb-6">
                Join our growing family! We offer a complete franchise model
                with training, support, and proven systems.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Full training provided
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Marketing support
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Supply chain included
                </li>
              </ul>
              <Link
                href="/franchise"
                className="inline-flex items-center gap-2 text-[#8B4513] font-medium hover:text-[#6B3410] transition-colors"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Markets */}
      <section className="py-16 md:py-24 bg-[#F5EDE0]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810]">
                Find Us This Week
              </h2>
              <p className="mt-2 text-[#5C4033]">
                Come and say hello! We would love to see you.
              </p>
            </div>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 text-[#8B4513] font-medium hover:text-[#6B3410] transition-colors"
            >
              View Full Schedule
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketSchedule.slice(0, 3).map((market, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 border border-[#E8DDD0]"
              >
                <h3 className="font-serif text-xl font-bold text-[#2D1810]">{market.name}</h3>
                <p className="text-[#8B4513] text-sm font-medium mt-1">{market.day}</p>
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
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">
                About Slindon Patisserie
              </h2>
              <div className="space-y-4 text-[#5C4033]">
                <p>
                  For over 40 years, Slindon Patisserie has been crafting traditional handmade bakery products
                  using recipes passed down through generations. Located in the heart of the South Downs National Park, 
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
                className="inline-flex items-center gap-2 mt-8 text-[#8B4513] font-medium hover:text-[#6B3410] transition-colors"
              >
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-[#E8DDD0] rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 text-[#8B4513] mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-[#2D1810]">{businessInfo.name}</h3>
                <p className="text-[#5C4033] mt-2">{businessInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-[#8B4513] text-white">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Have a question about our products or services? We would love to hear from you.
            Reach out and we will get back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#F5C518] text-[#8B4513] px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-2 border-white px-6 py-4 rounded-lg font-medium hover:bg-white hover:text-[#8B4513] transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

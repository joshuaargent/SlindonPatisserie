import Link from 'next/link';
import { ArrowRight, MapPin, ShoppingBag, Users, Building2, Phone, Clock } from 'lucide-react';
import { businessInfo, marketSchedule } from '@/data/site';

// ============================================
// Homepage - Slindon Patisserie
// ============================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#D42426] text-white">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-[#F5C518] text-sm font-medium tracking-wider uppercase mb-4">
              Handmade Patisserie Since 1740
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Traditional Bakery,<br />
              <span className="text-[#F5C518]">Modern Convenience</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              For over 40 years, we've been crafting handmade patisserie products using traditional recipes 
              and the finest ingredients. Find us at Camberley Market or order for collection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/markets"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-6 py-3 text-base font-medium text-[#D42426] transition-colors hover:bg-[#E8A818]"
              >
                <MapPin className="h-5 w-5" />
                Find Us at Markets
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-[#D42426]"
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
            <path d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="#FDF8F0"/>
          </svg>
        </div>
      </section>

      {/* Who Are You Section - Three Segments */}
      <section className="py-16 md:py-24 bg-[#FDF8F0]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810]">
              How Can We Help You?
            </h2>
            <p className="mt-4 text-[#5C4033] max-w-2xl mx-auto">
              Whether you're looking for fresh treats at the market, stocking your business, 
              or exploring franchise opportunities - we've got you covered.
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
                  Cafes & coffee shops
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Hotels & restaurants
                </li>
                <li className="flex items-center gap-2 text-sm text-[#5C4033]">
                  <span className="h-4 w-4 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-xs">✓</span>
                  Offices & corporate
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
                Join our growing family! We offer a complete "biz in a box" franchise model 
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
                Come and say hello! We'd love to see you.
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
                <p className="text-[#D42426] text-sm font-medium mt-1">{market.day}</p>
                <p className="text-[#5C4033] text-sm mt-2">{market.location}</p>
                <p className="text-[#6B5B4F] text-sm mt-1">{market.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Teaser */}
      <section className="py-16 md:py-24 bg-[#FDF8F0]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4A574] text-sm font-medium tracking-wider uppercase mb-4">
                Our Heritage
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">
                Over 40 Years of Craftsmanship
              </h2>
              <p className="text-[#5C4033] text-lg mb-6">
                Our story began in 1740, making us one of the oldest bakeries in the region. 
                Today, led by Master Baker Andrew Turner-Cross, we continue the traditions 
                that have made us a beloved fixture in the community.
              </p>
              <p className="text-[#5C4033] mb-8">
                Every product that leaves our bakery carries the same dedication to quality 
                that has defined us for nearly three centuries.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-[#8B4513] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#6B3410]"
              >
                Read Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-[#D4A574]/20 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <p className="font-serif text-6xl md:text-7xl font-bold text-[#8B4513]">1740</p>
                <p className="text-[#5C4033] mt-2">Our bakery was established</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-[#2D1810] text-[#FDF8F0]">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-[#F5EDE0]/80 max-w-2xl mx-auto mb-8">
            Have a question? We'd love to hear from you. 
            Whether it's about our products, wholesale opportunities, or franchise - we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8B4513] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#6B3410]"
            >
              <Phone className="h-5 w-5" />
              {businessInfo.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-[#D4A574] px-6 py-3 text-base font-medium text-[#D4A574] transition-colors hover:bg-[#D4A574] hover:text-[#2D1810]"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

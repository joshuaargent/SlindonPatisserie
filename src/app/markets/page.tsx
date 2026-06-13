import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react';
import { marketSchedule, businessInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Find Us at Markets',
  description: 'Visit Slindon Patisserie at farmers markets across the South East. Find us at Arundel, Shoreham, Ripley, Camberley, and more.',
};

export default function MarketsPage() {
  return (
    <div className="bg-[#F7F2E9]">
      {/* Hero */}
      <section className="bg-[#3A2C2A] text-[#F7F2E9] py-16 md:py-24">
        <div className="container">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#D0A246] hover:text-[#D0A246] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#F7F2E9]">
            Find Us at Markets
          </h1>
          <p className="mt-4 text-[#F7F2E9]/80 max-w-2xl text-lg">
            Come and say hello! We attend farmers markets across the South East, 
            bringing our handmade patisserie to your neighborhood.
          </p>
        </div>
      </section>

      {/* Market Schedule */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
              Our Market Schedule
            </h2>
            <p className="mt-4 text-[#6B5344] max-w-2xl mx-auto">
              Find us at these regular markets. We look forward to seeing you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketSchedule.map((market, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-[#E8DDD0] shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-full bg-[#D0A246]/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-[#8B1E22]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#3A2C2A]">
                      {market.name}
                    </h3>
                    <p className="text-[#D0A246] font-medium mt-1">{market.day}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#6B5344] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#6B5344]">{market.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#6B5344] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#6B5344]">{market.location}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[#6B5344] text-sm">{market.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-6">
              What to Expect
            </h2>
            <p className="text-[#6B5344] text-lg mb-8">
              When you visit our market stall, you'll find a warm welcome and 
              delicious products. Our friendly team is always happy to help you 
              find the perfect treats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-[#8B1E22] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Browse</h3>
              <p className="text-[#6B5344] text-sm">Explore our full range of fresh products</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-[#8B1E22] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Choose</h3>
              <p className="text-[#6B5344] text-sm">Select your favorites from our selection</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-[#8B1E22] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Pay</h3>
              <p className="text-[#6B5344] text-sm">Cash and card accepted at all markets</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-[#8B1E22] mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Enjoy!</h3>
              <p className="text-[#6B5344] text-sm">Take your treats home and enjoy!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
              What We Bring
            </h2>
            <p className="mt-4 text-[#6B5344] max-w-2xl mx-auto">
              Every week, we bring a fresh selection of our handmade products.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Croissants', 'Bread', 'Cakes', 'Pastries', 'Sourdough', 'Muffins', 'Cookies', 'Seasonal Specials'].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center border border-[#E8DDD0]">
                <p className="text-[#8B1E22] font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#3A2C2A] text-[#F7F2E9]">
        <div className="container text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Questions?
          </h2>
          <p className="text-[#F7F2E9]/80 max-w-2xl mx-auto mb-8">
            If you'd like to know more about our markets or arrange a bulk order, 
            please get in touch.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${businessInfo.phone}`}
              className="btn-primary text-lg px-8 py-4"
            >
              Call Us
            </a>
            <Link
              href="/contact"
              className="btn-outline-white text-lg px-6 py-4"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
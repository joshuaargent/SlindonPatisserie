import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, CheckCircle, Phone, Mail } from 'lucide-react';
import { businessInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Wholesale',
  description: 'Partner with Slindon Patisserie for wholesale bakery products. Supply your cafe, shop, or business with our award-winning patisserie.',
};

export default function WholesalePage() {
  return (
    <div className="bg-[#FDF8F0]">
      {/* Hero */}
      <section className="bg-[#2D1810] text-[#FDF8F0] py-16 md:py-24">
        <div className="container">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#D4A574] hover:text-[#C9A962] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            Wholesale Partnership
          </h1>
          <p className="mt-4 text-[#F5EDE0]/80 max-w-2xl text-lg">
            Stock your business with our award-winning handmade patisserie products. 
            Fresh daily delivery available.
          </p>
        </div>
      </section>

      {/* Why Wholesale */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4A574] text-sm font-medium tracking-wider uppercase mb-4">
                Why Partner With Us
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">
                Quality Products, Reliable Service
              </h2>
              <p className="text-[#5C4033] mb-8">
                We've been supplying businesses across the South East for over 40 years. 
                Our reputation for quality and reliability has made us the go-to choice for 
                cafes, shops, and restaurants.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Handmade Daily</h3>
                    <p className="text-[#5C4033] text-sm">Every product is made fresh each day by our skilled bakers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Competitive Pricing</h3>
                    <p className="text-[#5C4033] text-sm">Special wholesale rates for registered businesses</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Flexible Ordering</h3>
                    <p className="text-[#5C4033] text-sm">Regular standing orders or one-off purchases</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Reliable Delivery</h3>
                    <p className="text-[#5C4033] text-sm">Daily delivery to your door in temperature-controlled vehicles</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0] shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-8 w-8 text-[#8B4513]" />
                <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
                  We Supply
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Cafes & Coffee Shops',
                  'Hotels & Guest Houses',
                  'Restaurants & Pubs',
                  'Shops & Delis',
                  'Offices & Corporate',
                  'Care Homes & Schools',
                  'Event Caterers',
                  'Food Trucks',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#D4A574]"></span>
                    <span className="text-[#5C4033]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 md:py-24 bg-[#F5EDE0]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810]">
              Our Wholesale Range
            </h2>
            <p className="mt-4 text-[#5C4033] max-w-2xl mx-auto">
              We offer a wide variety of products suitable for wholesale. All items 
              are handmade daily using traditional recipes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Pastries', items: 'Croissants, Pain au Chocolat, Danish' },
              { name: 'Bread', items: 'Sourdough, Ciabatta, Baguettes' },
              { name: 'Cakes', items: 'Sponge, Cheesecake, Carrot Cake' },
              { name: 'Savory', items: 'Sausage Rolls, Quiches, Sandwiches' },
              { name: 'Seasonal', items: 'Christmas Puddings, Easter Eggs' },
              { name: 'Biscuits', items: 'Cookies, Shortbread, Brownies' },
              { name: 'Viennoiserie', items: 'Almond Croissants, Cinnamon Rolls' },
              { name: 'Custom', items: 'Tailored to your requirements' },
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-[#E8DDD0]">
                <h3 className="font-semibold text-[#2D1810] mb-2">{category.name}</h3>
                <p className="text-[#6B5B4F] text-sm">{category.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">
              Let's Talk
            </h2>
            <p className="text-[#5C4033] mb-8">
              Ready to start stocking our products? Get in touch to discuss your 
              requirements and receive our wholesale price list.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${businessInfo.phone}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#8B4513] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#6B3410]"
              >
                <Phone className="h-5 w-5" />
                Call to Discuss
              </a>
              <Link
                href="/contact?type=wholesale"
                className="inline-flex items-center gap-2 rounded-lg border border-[#8B4513] px-6 py-3 text-base font-medium text-[#8B4513] transition-colors hover:bg-[#8B4513] hover:text-white"
              >
                <Mail className="h-5 w-5" />
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
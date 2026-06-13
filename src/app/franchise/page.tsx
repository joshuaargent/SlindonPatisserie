import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, DollarSign, TrendingUp, Shield, Phone, Mail } from 'lucide-react';
import { businessInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Franchise Opportunities',
  description: 'Join the Slindon Patisserie family with our complete franchise model. Training, support, and a proven business system included.',
};

export default function FranchisePage() {
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
            Franchise Opportunities
          </h1>
          <p className="mt-4 text-[#F7F2E9]/80 max-w-2xl text-lg">
            Join our growing family and build your own successful bakery business 
            with our complete "biz in a box" franchise model.
          </p>
        </div>
      </section>

      {/* What is Franchise */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D0A246] text-sm font-medium tracking-wider uppercase mb-4">
                The Opportunity
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-6">
                Own Your Dream Bakery
              </h2>
              <p className="text-[#6B5344] text-lg mb-6">
                Our franchise model gives you everything you need to launch and run 
                a successful patisserie business. We've refined our systems over 
                decades of operation.
              </p>
              <p className="text-[#6B5344] mb-8">
                Whether you're starting fresh or transitioning from another industry, 
                our comprehensive support ensures you'll have the tools, training, and 
                ongoing guidance to succeed.
              </p>
            </div>
            
            <div className="bg-[#D0A246]/20 rounded-2xl p-8 text-center">
              <p className="font-serif text-6xl font-bold text-[#8B1E22]">"Biz in a Box"</p>
              <p className="text-[#6B5344] mt-4">Complete business solution for aspiring bakery owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
              What's Included
            </h2>
            <p className="mt-4 text-[#6B5344] max-w-2xl mx-auto">
              Our franchise package provides everything you need to get started and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0]">
              <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#8B1E22]" />
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Full Training</h3>
              <p className="text-[#6B5344] text-sm">
                Comprehensive training program covering all aspects of the business, 
                from baking techniques to customer service.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0]">
              <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#8B1E22]" />
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Equipment & Setup</h3>
              <p className="text-[#6B5344] text-sm">
                Complete equipment package and guidance on setting up your bakery 
                to our exacting standards.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0]">
              <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#8B1E22]" />
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Marketing Support</h3>
              <p className="text-[#6B5344] text-sm">
                Proven marketing strategies, branding support, and ongoing promotion 
                to help you build your customer base.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0]">
              <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-[#8B1E22]" />
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Supply Chain</h3>
              <p className="text-[#6B5344] text-sm">
                Access to our established supply chain for ingredients, packaging, 
                and other essentials at competitive rates.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0]">
              <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#8B1E22]" />
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Ongoing Support</h3>
              <p className="text-[#6B5344] text-sm">
                Continuous support from our team including regular check-ins, 
                troubleshooting, and business development advice.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0]">
              <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#8B1E22]" />
              </div>
              <h3 className="font-semibold text-[#3A2C2A] mb-2">Proven Systems</h3>
              <p className="text-[#6B5344] text-sm">
                Benefit from decades of refinement with our documented processes, 
                recipes, and operational procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
                Is This Right For You?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-[#E8DDD0]">
                <h3 className="font-semibold text-[#3A2C2A] mb-3">Ideal Franchisee</h3>
                <ul className="space-y-2">
                  {[
                    'Passionate about food and baking',
                    'Business-minded with management skills',
                    'Looking for a hands-on role',
                    'Strong customer service ethic',
                    'Ready to commit to building a business',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#6B5344] text-sm">
                      <span className="text-[#8B1E22]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#E8DDD0]">
                <h3 className="font-semibold text-[#3A2C2A] mb-3">Investment Details</h3>
                <ul className="space-y-2">
                  {[
                    'Investment levels vary based on setup',
                    'Flexible financing options available',
                    'ROI focused on sustainable growth',
                    'Comprehensive support maximizes success',
                    'Contact us for personalized information',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#6B5344] text-sm">
                      <span className="text-[#8B1E22]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#3A2C2A] text-[#F7F2E9]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Let's Start a Conversation
            </h2>
            <p className="text-[#F7F2E9]/80 mb-8">
              Every franchise journey starts with a conversation. Whether you have 
              questions about the opportunity, want to understand the investment, 
              or are ready to take the next step - we're here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${businessInfo.phone}`}
                className="btn-primary text-lg px-8 py-4"
              >
                <Phone className="h-5 w-5" />
                Call to Discuss
              </a>
              <Link
                href="/contact?type=franchise"
                className="btn-outline-white text-lg px-6 py-4"
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
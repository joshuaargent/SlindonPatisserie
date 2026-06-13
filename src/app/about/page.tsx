import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Award, Users, Heart } from 'lucide-react';
import { businessInfo, teamMembers } from '@/data/site';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about Slindon Patisserie\'s rich heritage and commitment to traditional baking since 1740.',
};

export default function AboutPage() {
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
            Our Story
          </h1>
          <p className="mt-4 text-[#F7F2E9]/80 max-w-2xl text-lg">
            Handmade patisserie since 1740. A legacy of quality, tradition, and passion.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D0A246] text-sm font-medium tracking-wider uppercase mb-4">
                Our Heritage
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A] mb-6">
                Nearly 300 Years of Excellence
              </h2>
              <div className="space-y-4 text-[#6B5344]">
                <p>
                  {businessInfo.history}
                </p>
                <p>
                  In the heart of the South Downs National Park, our bakery has been 
                  a cornerstone of the community for generations. From humble beginnings 
                  to becoming a beloved fixture at farmers markets across the South East, 
                  our commitment to quality has never wavered.
                </p>
                <p>
                  Today, we continue the traditions established nearly three centuries ago, 
                  using time-honored recipes and the finest locally-sourced ingredients. 
                  Every croissant is hand-laminated, every loaf is hand-shaped, and every 
                  cake is decorated with care.
                </p>
              </div>
            </div>
            <div className="bg-[#D0A246]/20 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <p className="font-serif text-8xl md:text-9xl font-bold text-[#8B1E22]">1740</p>
                <p className="text-[#6B5344] mt-4 text-lg">Est.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
              What We Believe
            </h2>
            <p className="mt-4 text-[#6B5344] max-w-2xl mx-auto">
              Our values guide everything we do, from the ingredients we select to the 
              relationships we build with our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0]">
              <div className="h-16 w-16 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-[#8B1E22]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-3">
                Quality Above All
              </h3>
              <p className="text-[#6B5344]">
                We never compromise on ingredients or craftsmanship. Every product 
                that leaves our bakery meets our exacting standards.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0]">
              <div className="h-16 w-16 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-[#8B1E22]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-3">
                Made With Love
              </h3>
              <p className="text-[#6B5344]">
                Baking is our passion. Every item is handmade by skilled bakers 
                who take pride in their craft.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0]">
              <div className="h-16 w-16 rounded-full bg-[#D0A246]/20 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#8B1E22]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-3">
                Community First
              </h3>
              <p className="text-[#6B5344]">
                We're more than a bakery - we're part of the community. We believe 
                in building relationships that last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A2C2A]">
              Meet Our Team
            </h2>
            <p className="mt-4 text-[#6B5344] max-w-2xl mx-auto">
              The passionate people behind every delicious product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="h-32 w-32 rounded-full bg-[#D0A246]/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="font-serif text-4xl text-[#8B1E22]">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#3A2C2A]">
                  {member.name}
                </h3>
                <p className="text-[#D0A246] font-medium">{member.role}</p>
                <p className="text-[#6B5344] mt-2 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#3A2C2A] text-[#F7F2E9]">
        <div className="container text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Visit Us at a Market
          </h2>
          <p className="text-[#F7F2E9]/80 max-w-2xl mx-auto mb-8">
            Come and taste the difference for yourself. We'd love to see you at one 
            of our weekly farmers markets.
          </p>
          <Link
            href="/markets"
            className="btn-primary text-lg px-8 py-4"
          >
            View Market Schedule
          </Link>
        </div>
      </section>
    </div>
  );
}
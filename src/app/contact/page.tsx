import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { businessInfo } from '@/data/site';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Slindon Patisserie. Questions about our products, wholesale, or franchise? We\'d love to hear from you.',
};

export default function ContactPage() {
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
            Get In Touch
          </h1>
          <p className="mt-4 text-[#F7F2E9]/80 max-w-2xl text-lg">
            We'd love to hear from you. Whether you have a question about our 
            products, wholesale opportunities, or franchise - we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#8B1E22]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3A2C2A]">Phone</h3>
                    <a href={`tel:${businessInfo.phone}`} className="text-[#8B1E22] hover:text-[#9B2A32] transition-colors">
                      {businessInfo.phone}
                    </a>
                    <p className="text-[#6B5344] text-sm mt-1">Mon-Fri 9am-5pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#8B1E22]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3A2C2A]">Email</h3>
                    <a href={`mailto:${businessInfo.email}`} className="text-[#8B1E22] hover:text-[#9B2A32] transition-colors">
                      {businessInfo.email}
                    </a>
                    <p className="text-[#6B5344] text-sm mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[#8B1E22]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3A2C2A]">Visit Us</h3>
                    <p className="text-[#6B5344]">
                      {businessInfo.address}<br />
                      Or find us at our weekly markets
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white rounded-2xl border border-[#E8DDD0]">
                <h3 className="font-semibold text-[#3A2C2A] mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/markets" className="block text-[#8B1E22] hover:text-[#9B2A32] transition-colors">
                    → Find us at markets
                  </Link>
                  <Link href="/wholesale" className="block text-[#8B1E22] hover:text-[#9B2A32] transition-colors">
                    → Wholesale enquiries
                  </Link>
                  <Link href="/franchise" className="block text-[#8B1E22] hover:text-[#9B2A32] transition-colors">
                    → Franchise opportunities
                  </Link>
                  <Link href="/contact?type=delivery" className="block text-[#8B1E22] hover:text-[#9B2A32] transition-colors font-medium">
                    → Enquire about delivery →
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0] shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-6">
                Send Us a Message
              </h2>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
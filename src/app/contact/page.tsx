import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { businessInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Slindon Patisserie. Questions about our products, wholesale, or franchise? We\'d love to hear from you.',
};

export default function ContactPage() {
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
            Get In Touch
          </h1>
          <p className="mt-4 text-[#F5EDE0]/80 max-w-2xl text-lg">
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
              <h2 className="font-serif text-2xl font-bold text-[#2D1810] mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Phone</h3>
                    <a href={`tel:${businessInfo.phone}`} className="text-[#8B4513] hover:text-[#6B3410] transition-colors">
                      {businessInfo.phone}
                    </a>
                    <p className="text-[#6B5B4F] text-sm mt-1">Mon-Fri 9am-5pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Email</h3>
                    <a href={`mailto:${businessInfo.email}`} className="text-[#8B4513] hover:text-[#6B3410] transition-colors">
                      {businessInfo.email}
                    </a>
                    <p className="text-[#6B5B4F] text-sm mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[#8B4513]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2D1810]">Visit Us</h3>
                    <p className="text-[#5C4033]">
                      {businessInfo.address}<br />
                      Or find us at our weekly markets
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white rounded-2xl border border-[#E8DDD0]">
                <h3 className="font-semibold text-[#2D1810] mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/markets" className="block text-[#8B4513] hover:text-[#6B3410] transition-colors">
                    → Find us at markets
                  </Link>
                  <Link href="/wholesale" className="block text-[#8B4513] hover:text-[#6B3410] transition-colors">
                    → Wholesale enquiries
                  </Link>
                  <Link href="/franchise" className="block text-[#8B4513] hover:text-[#6B3410] transition-colors">
                    → Franchise opportunities
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0] shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-[#2D1810] mb-6">
                Send Us a Message
              </h2>
              
              <form className="space-y-6" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#5C4033] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#2D1810] focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#5C4033] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#2D1810] focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#5C4033] mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#2D1810] focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    placeholder="07700 900000"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#5C4033] mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#2D1810] focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Enquiry</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="franchise">Franchise</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#5C4033] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#2D1810] focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#8B4513] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#6B3410]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
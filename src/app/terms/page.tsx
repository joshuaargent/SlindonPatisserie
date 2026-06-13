import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { businessInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for Slindon Patisserie. The terms governing your use of our website and services.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#F7F2E9]">
      {/* Hero */}
      <section className="bg-[#3A2C2A] text-[#F7F2E9] py-16">
        <div className="container">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#D0A246] hover:text-[#D0A246] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#F7F2E9]">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-[#F7F2E9]/80">
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-[#6B5344]">
              Welcome to the {businessInfo.name} website. By using our website, you agree 
              to these terms and conditions.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">1. General</h2>
            <p className="text-[#6B5344]">
              {businessInfo.name} is a family-run bakery business based in Slindon, West Sussex. 
              These terms apply to your use of our website and any services we provide.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">2. Products & Orders</h2>
            <p className="text-[#6B5344]">
              Our products are handmade and subject to availability. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B5344]">
              <li>Modify prices without notice</li>
              <li>Discontinue products at any time</li>
              <li>Limit order quantities</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">3. Collection & Delivery</h2>
            <p className="text-[#6B5344]">
              For collection orders:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B5344]">
              <li>Payment is due upon collection</li>
              <li>Orders should be collected within agreed timeframes</li>
              <li>Please bring your order confirmation</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">4. Wholesale Terms</h2>
            <p className="text-[#6B5344]">
              Wholesale accounts are subject to separate terms and conditions. Please 
              contact us for details on our wholesale agreement.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">5. Franchise</h2>
            <p className="text-[#6B5344]">
              Franchise opportunities are subject to a separate franchise agreement. All 
              franchise enquiries are handled on an individual basis.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">6. Website Use</h2>
            <p className="text-[#6B5344]">
              You agree to use our website only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B5344]">
              <li>Use our website in any way that causes damage</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Introduce viruses or other malicious content</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-[#6B5344]">
              All content on this website, including text, images, and logos, is the 
              property of {businessInfo.name} and protected by copyright laws.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">8. Liability</h2>
            <p className="text-[#6B5344]">
              We strive to ensure accuracy on our website but cannot guarantee all 
              information is current or complete. We are not liable for any indirect or 
              consequential losses arising from use of this website.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">9. Changes to Terms</h2>
            <p className="text-[#6B5344]">
              We may update these terms at any time. Continued use of the website 
              constitutes acceptance of any changes.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">10. Contact</h2>
            <p className="text-[#6B5344]">
              For questions about these terms, please contact us:
            </p>
            <ul className="list-none space-y-2 text-[#6B5344] mt-4">
              <li><strong>Email:</strong> {businessInfo.email}</li>
              <li><strong>Phone:</strong> {businessInfo.phone}</li>
              <li><strong>Address:</strong> {businessInfo.address}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
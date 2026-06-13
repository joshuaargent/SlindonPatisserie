import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { businessInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Slindon Patisserie. How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
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
          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            Privacy Policy
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
              {businessInfo.name} ("we", "our", or "us") is committed to protecting and 
              respecting your privacy. This Privacy Policy explains how we collect, use, 
              and safeguard your personal information when you use our website.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-[#6B5344]">
              We may collect and process the following information about you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B5344]">
              <li><strong>Contact Information:</strong> Name, email address, phone number when you contact us</li>
              <li><strong>Enquiry Data:</strong> Information you provide when filling out contact forms</li>
              <li><strong>Usage Data:</strong> Information about how you use our website (collected automatically)</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-[#6B5344]">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B5344]">
              <li>Respond to your enquiries</li>
              <li>Process wholesale or franchise enquiries</li>
              <li>Send you information about our products and services (with your consent)</li>
              <li>Improve our website and services</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">3. Data Security</h2>
            <p className="text-[#6B5344]">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">4. Cookies</h2>
            <p className="text-[#6B5344]">
              Our website may use cookies to enhance your browsing experience. You can 
              control cookie settings through your browser preferences.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">5. Your Rights</h2>
            <p className="text-[#6B5344]">
              Under GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B5344]">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mt-8 mb-4">6. Contact Us</h2>
            <p className="text-[#6B5344]">
              If you have any questions about this Privacy Policy or wish to exercise your 
              rights, please contact us:
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
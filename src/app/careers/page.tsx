'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Clock, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields')
      return
    }

    // In production, this would submit to an API
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F2E9]">
        <div className="bg-[#8B1E22] text-white py-4">
          <div className="container mx-auto px-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-[#8B1E22] mb-2">Application Received!</h2>
            <p className="text-[#6B5344] mb-6">
              Thank you for your interest in joining the Slindon Patisserie team. We'll be in touch soon.
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-[#8B1E22] font-semibold hover:underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <div className="bg-[#8B1E22] text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#8B1E22] mb-4">Join Our Team</h1>
          <p className="text-[#6B5344] text-lg max-w-2xl">
            We're always looking for passionate people to join our bakery family. If you love baking 
            and want to be part of a great team, we'd love to hear from you.
          </p>
        </div>

        {/* Job Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Briefcase className="w-8 h-8 text-[#D0A246] mb-4" />
            <h3 className="font-semibold text-[#8B1E22] mb-2">Part-Time Positions</h3>
            <p className="text-sm text-[#6B5344]">
              We primarily offer weekday part-time positions. Flexible hours available.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Clock className="w-8 h-8 text-[#D0A246] mb-4" />
            <h3 className="font-semibold text-[#8B1E22] mb-2">Weekday Hours</h3>
            <p className="text-sm text-[#6B5344]">
              Shifts typically between 6am and 6pm, Monday to Friday. Some flexibility required.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <MapPin className="w-8 h-8 text-[#D0A246] mb-4" />
            <h3 className="font-semibold text-[#8B1E22] mb-2">Based in Camberley</h3>
            <p className="text-sm text-[#6B5344]">
              Our bakery is located in Camberley, Surrey. Easy parking and good transport links.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#8B1E22] mb-6">Apply Now</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#6B5344] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#6B5344] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#6B5344] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent"
                  placeholder="01234 567890"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Tell Us About Yourself *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-[#6B5344] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent resize-none"
                  placeholder="Tell us about your experience, availability, and why you'd like to join our team..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#8B1E22] text-white rounded-lg font-semibold hover:bg-[#9B2A32] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Application
              </button>
            </form>

            <p className="mt-4 text-sm text-[#6B5344] text-center">
              Or email us directly at <span className="text-[#8B1E22]">careers@slindonpatisserie.co.uk</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
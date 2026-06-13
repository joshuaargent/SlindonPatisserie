'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialType,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-2">Message Sent!</h3>
        <p className="text-[#6B5344] mb-6">
          Thank you for your message. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-outline-red"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#6B5344] mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#3A2C2A] focus:border-[#8B1E22] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/20"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#6B5344] mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#3A2C2A] focus:border-[#8B1E22] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/20"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#6B5344] mb-2">
          Phone (optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#3A2C2A] focus:border-[#8B1E22] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/20"
          placeholder="07700 900000"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-[#6B5344] mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#3A2C2A] focus:border-[#8B1E22] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/20"
        >
          <option value="">Select a topic</option>
          <option value="general">General Enquiry</option>
          <option value="wholesale">Wholesale</option>
          <option value="franchise">Franchise</option>
          <option value="delivery">Delivery</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#6B5344] mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-[#3A2C2A] focus:border-[#8B1E22] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/20"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary text-lg px-8 py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
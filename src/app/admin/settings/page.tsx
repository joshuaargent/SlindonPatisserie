'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Database, CreditCard, Key, Globe, Mail, Loader2, ExternalLink } from 'lucide-react'

interface SystemStatus {
  teya: { configured: boolean; clientId?: string; storeId?: string }
  database: { connected: boolean; tables: number }
  email: { configured: boolean }
}

export default function AdminSettingsPage() {
  const [status, setStatus] = useState< SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Check Teya status
        const teyaRes = await fetch('/api/teya/status')
        const teyaData = await teyaRes.json()

        // Check database by fetching products count
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()

        setStatus({
          teya: teyaData,
          database: {
            connected: productsRes.ok,
            tables: 0,
          },
          email: {
            configured: false,
          },
        })
      } catch (err) {
        console.error('Failed to fetch status:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B1E22]" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Settings</h1>
        <p className="text-[#6B5344] mt-1">System configuration and integrations</p>
      </div>

      {/* System Status */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#3A2C2A] mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Database */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${status?.database.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <Database className="w-5 h-5 text-[#6B5344]" />
              <span className="font-medium text-[#3A2C2A]">Database</span>
            </div>
            <p className="text-sm text-[#6B5344]">
              {status?.database.connected ? 'Connected to Supabase' : 'Connection failed'}
            </p>
          </div>

          {/* Teya Payment */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${status?.teya.configured ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <CreditCard className="w-5 h-5 text-[#6B5344]" />
              <span className="font-medium text-[#3A2C2A]">Teya Payments</span>
            </div>
            <p className="text-sm text-[#6B5344]">
              {status?.teya.configured 
                ? `Configured (Store: ${status.teya.storeId?.slice(-4) || '***'})`
                : 'Not configured - Add TEYA credentials to .env'}
            </p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <Mail className="w-5 h-5 text-[#6B5344]" />
              <span className="font-medium text-[#3A2C2A]">Email (Resend)</span>
            </div>
            <p className="text-sm text-[#6B5344]">
              Add RESEND_API_KEY to .env to enable email
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Guide */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#3A2C2A] mb-4">Environment Variables</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-[#6B5344] mt-0.5" />
              <div>
                <p className="font-medium text-[#3A2C2A]">Supabase (Required)</p>
                <code className="text-sm text-[#6B5344] block mt-1">
                  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
                </code>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-[#6B5344] mt-0.5" />
              <div>
                <p className="font-medium text-[#3A2C2A]">Teya Payments (Recommended)</p>
                <code className="text-sm text-[#6B5344] block mt-1">
                  TEYA_CLIENT_ID, TEYA_CLIENT_SECRET, TEYA_STORE_ID, TEYA_WEBHOOK_SECRET
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#6B5344] mt-0.5" />
              <div>
                <p className="font-medium text-[#3A2C2A]">Email (Optional)</p>
                <code className="text-sm text-[#6B5344] block mt-1">
                  RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_TO_EMAIL
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#6B5344] mt-0.5" />
              <div>
                <p className="font-medium text-[#3A2C2A]">Site</p>
                <code className="text-sm text-[#6B5344] block mt-1">
                  NEXT_PUBLIC_SITE_URL=https://yourdomain.com
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#3A2C2A] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#6B5344] hover:text-[#8B1E22] transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#6B5344] hover:text-[#8B1E22] transition-colors"
          >
            View Orders
          </Link>
          <a
            href="/api/products"
            target="_blank"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#6B5344] hover:text-[#8B1E22] transition-colors flex items-center gap-2"
          >
            View Products API <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#6B5344] hover:text-[#8B1E22] transition-colors flex items-center gap-2"
          >
            Supabase Dashboard <ExternalLink className="w-4 h-4" />
          </a>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#6B5344] hover:text-[#8B1E22] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

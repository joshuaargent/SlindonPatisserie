'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { useSupabaseUser } from '@/components/providers/SupabaseProvider'

interface ProfileData {
  name: string
  phone: string
}

export default function AccountSettingsPage() {
  const { user, refresh } = useSupabaseUser()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    
    fetch('/api/account/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setName(data.profile.name || '')
          setPhone(data.profile.phone || '')
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      await refresh()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] flex items-center justify-center">
        <p className="text-[#6B5344]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      <div className="bg-[#8B1E22] text-[#F7F2E9] py-4">
        <div className="container mx-auto px-4">
          <Link href="/account" className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Account
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-[#3A2C2A] mb-8">Account Settings</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
              <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E8DDD0]">
              <div className="w-16 h-16 bg-[#F7F2E9] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#8B1E22]" />
              </div>
              <div>
                <p className="font-semibold text-[#3A2C2A]">{user.user_metadata?.name || 'User'}</p>
                <p className="text-sm text-[#6B5344]">{user.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A2C2A] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A2C2A] mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                placeholder="01234 567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A2C2A] mb-2">Email Address</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg bg-[#F7F2E9] text-[#6B5344]"
              />
              <p className="text-xs text-[#6B5344] mt-1">Email cannot be changed here. Contact support to update your email.</p>
            </div>

            <div className="flex gap-3">
              <Link href="/account" className="px-6 py-3 border border-[#E8DDD0] rounded-lg text-[#6B5344] hover:bg-[#F7F2E9] transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {saving ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-[#3A2C2A] mb-4">Additional Settings</h2>
            <Link
              href="/account/preferences"
              className="block text-[#8B1E22] hover:underline text-sm"
            >
              Notification & communication preferences →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowLeft, User, Package, Settings, LogOut, ChevronRight } from 'lucide-react'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F2E9] flex items-center justify-center">
        <div className="text-[#8B1E22]">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <div className="bg-[#8B1E22] text-[#F7F2E9] py-4">
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
          <h1 className="text-4xl font-serif font-bold text-[#8B1E22] mb-2">My Account</h1>
          <p className="text-[#6B5344]">
            Welcome back, {user.name}
          </p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F7F2E9] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#8B1E22]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#8B1E22]">{user.name}</h2>
              <p className="text-[#6B5344]">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#D0A246] text-[#3A2C2A] rounded">
                {user.role === 'wholesale' ? 'Wholesale Account' : user.role === 'admin' ? 'Admin' : 'Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {/* Orders */}
          <Link
            href="/account/orders"
            className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F7F2E9] rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#8B1E22]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B1E22]">My Orders</h3>
                  <p className="text-sm text-[#6B5344]">View your order history</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B5344]" />
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/account/settings"
            className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F7F2E9] rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-[#8B1E22]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#8B1E22]">Account Settings</h3>
                  <p className="text-sm text-[#6B5344]">Update your profile and preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B5344]" />
            </div>
          </Link>

          {/* Wholesale Info (only for wholesale users) */}
          {user.role === 'wholesale' && (
            <Link
              href="/wholesale"
              className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F7F2E9] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#8B1E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#8B1E22]">Wholesale Portal</h3>
                    <p className="text-sm text-[#6B5344]">Access wholesale pricing and bulk orders</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B5344]" />
              </div>
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-600">Sign Out</h3>
                <p className="text-sm text-[#6B5344]">Log out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Star,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Boxes,
  Building2,
} from 'lucide-react'
import { useSupabaseUser } from '@/components/providers/SupabaseProvider'

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Stock', href: '/admin/stock', icon: Boxes },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Wholesale', href: '/admin/wholesale', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useSupabaseUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [roleLoading, setRoleLoading] = useState(true)

  const userName = user?.user_metadata?.name || user?.email || 'Admin'
  const userInitial = userName.charAt(0).toUpperCase()

  // Check admin role from database (by authId)
  useEffect(() => {
    if (!user) {
      setRoleLoading(false)
      return
    }
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()

    supabase
      .from('User')
      .select('role')
      .eq('authId', user.id)
      .maybeSingle()
      .then(({ data }: { data: { role: string } | null }) => {
        setIsAdmin(data?.role === 'admin')
        setRoleLoading(false)
      })
  }, [user])

  // Redirect non-admins once role is confirmed
  useEffect(() => {
    if (!loading && !roleLoading && !user) {
      sessionStorage.setItem('adminLoginMessage', 'You need to be logged in to access the admin dashboard.')
      router.push('/login')
    }
    if (!loading && !roleLoading && user && !isAdmin) {
      sessionStorage.setItem('adminLoginMessage', 'You need to be an admin to access this page.')
      router.push('/login')
    }
  }, [loading, roleLoading, user, isAdmin, router])

  // Show loading while auth or role is being checked
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#8B1E22] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6B5344] text-sm">Checking access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header - Matching main site style */}
      <header className="bg-[#8B1E22] text-white sticky top-0 z-50 shadow-md">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <span className="text-2xl">🥐</span>
              <div>
                <span className="font-serif font-bold text-lg">Slindon Admin</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Settings */}
              <Link
                href="/admin/settings"
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-[#D0A246] flex items-center justify-center text-[#3A2C2A] font-bold text-sm">
                    {userInitial}
                  </div>
                  <span className="hidden lg:block text-sm">{userName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-[#3A2C2A]">
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F7F2E9]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      View Website
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F7F2E9] text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden border-t border-white/10 py-4">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
              <Link
                href="/admin/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  )
}
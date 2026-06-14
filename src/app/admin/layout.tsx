'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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
  Boxes
} from 'lucide-react'
import { useState } from 'react'

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Stock', href: '/admin/stock', icon: Boxes },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
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
                    {session?.user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden lg:block text-sm">{session?.user?.name || 'Admin'}</span>
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
                      onClick={handleSignOut}
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
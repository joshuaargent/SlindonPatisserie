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
      {/* Admin Sidebar - Fixed left side on desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[#E8DDD0]">
        <div className="p-4 border-b border-[#E8DDD0]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🥐</span>
            <span className="font-serif font-bold text-[#8B1E22]">Slindon Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#8B1E22] text-white'
                    : 'text-[#6B5344] hover:bg-[#F7F2E9]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#E8DDD0]">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B5344] hover:bg-[#F7F2E9] rounded-lg"
          >
            <span className="text-lg">🌐</span>
            View Website
          </Link>
        </div>
      </aside>

      {/* Mobile Admin Header - Below main navbar */}
      <header className="lg:hidden bg-white border-b border-[#E8DDD0] sticky top-16 z-40">
        <div className="container flex items-center justify-between h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl">🥐</span>
            <span className="font-serif font-bold text-[#8B1E22]">Admin</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#6B5344] hover:bg-[#F7F2E9] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-[#E8DDD0] py-2">
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
                      ? 'bg-[#8B1E22] text-white'
                      : 'text-[#6B5344] hover:bg-[#F7F2E9]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      {/* Main Content - Offset for sidebar on desktop */}
      <main className="lg:ml-64 pt-0 lg:pt-16">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
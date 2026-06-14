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
  Star,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Mobile Admin Nav - only visible on mobile */}
      <div className="lg:hidden bg-white border-b border-[#E8DDD0]">
        <div className="container">
          <div className="flex items-center justify-between h-12">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg">🥐</span>
              <span className="font-serif font-bold text-[#8B1E22] text-sm">Admin</span>
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#6B5344]"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="pb-3 space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      isActive
                        ? 'bg-[#8B1E22] text-white'
                        : 'text-[#6B5344] hover:bg-[#F7F2E9]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  )
}
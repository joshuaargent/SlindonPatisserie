'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, Boxes } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Admin Nav Bar */}
      <div className="bg-white border-b border-[#E8DDD0] sticky top-16 z-40">
        <div className="container">
          <div className="flex items-center gap-6 h-12 overflow-x-auto">
            <Link href="/admin" className="flex items-center gap-2 shrink-0">
              <span className="text-lg">🥐</span>
              <span className="font-serif font-bold text-[#8B1E22] text-sm">Admin</span>
            </Link>
            
            <nav className="flex items-center gap-1">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  )
}
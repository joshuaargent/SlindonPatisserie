import Link from 'next/link'
import { Settings, Database, Palette, Bell, CreditCard, Key } from 'lucide-react'

const settingsSections = [
  {
    title: 'General',
    icon: Settings,
    description: 'Business name, contact info, location',
    href: '/admin/settings/general',
    status: 'coming-soon',
  },
  {
    title: 'Appearance',
    icon: Palette,
    description: 'Theme, colors, logos',
    href: '/admin/settings/appearance',
    status: 'coming-soon',
  },
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Email alerts, order notifications',
    href: '/admin/settings/notifications',
    status: 'coming-soon',
  },
  {
    title: 'Payments',
    icon: CreditCard,
    description: 'Teya, PayPal, Stripe settings',
    href: '/admin/settings/payments',
    status: 'coming-soon',
  },
  {
    title: 'Security',
    icon: Key,
    description: 'Password, 2FA, API keys',
    href: '/admin/settings/security',
    status: 'coming-soon',
  },
  {
    title: 'Database',
    icon: Database,
    description: 'Prisma, migrations, backups',
    href: '/admin/settings/database',
    status: 'coming-soon',
  },
]

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#2D1810]">Settings</h1>
        <p className="text-[#5C4033] mt-1">Configure your store settings and integrations</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FDF8F0] rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#5C4033]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2D1810]">{section.title}</h3>
                  <span className="text-xs text-[#D42426] font-medium">Coming Soon</span>
                </div>
              </div>
              <p className="text-sm text-[#5C4033]">{section.description}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#2D1810] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#5C4033] hover:text-[#D42426] transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#5C4033] hover:text-[#D42426] transition-colors"
          >
            View Orders
          </Link>
          <a
            href="/api/products"
            target="_blank"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#5C4033] hover:text-[#D42426] transition-colors"
          >
            View Products API
          </a>
          <a
            href="/admin"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-[#5C4033] hover:text-[#D42426] transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
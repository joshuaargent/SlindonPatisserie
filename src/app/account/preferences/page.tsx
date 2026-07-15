'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, Mail, BellOff } from 'lucide-react'
import { useState } from 'react'

export default function AccountPreferencesPage() {
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotionalEmails: false,
    wholesaleUpdates: false,
    newsletter: false,
  })
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      <div className="bg-[#8B1E22] text-[#F7F2E9] py-4">
        <div className="container mx-auto px-4">
          <Link href="/account/settings" className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Settings
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-[#3A2C2A] mb-2">Preferences</h1>
          <p className="text-[#6B5344] mb-8">Manage how we communicate with you</p>

          <div className="bg-white rounded-lg shadow-sm divide-y divide-[#E8DDD0]">
            {[
              {
                key: 'orderUpdates',
                title: 'Order Updates',
                description: 'Receive emails about your order status and collection reminders',
                icon: Mail,
              },
              {
                key: 'promotionalEmails',
                title: 'Promotional Emails',
                description: 'New products, seasonal specials, and exclusive offers',
                icon: Bell,
              },
              {
                key: 'wholesaleUpdates',
                title: 'Wholesale Updates',
                description: 'Updates about your wholesale account and bulk order availability',
                icon: Bell,
              },
              {
                key: 'newsletter',
                title: 'Newsletter',
                description: 'Weekly baking news, recipes, and behind-the-scenes updates',
                icon: Bell,
              },
            ].map(({ key, title, description, icon: Icon }) => (
              <div key={key} className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F7F2E9] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-[#8B1E22]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#3A2C2A]">{title}</p>
                    <p className="text-sm text-[#6B5344]">{description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(key as keyof typeof preferences)}
                  className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                    preferences[key as keyof typeof preferences] ? 'bg-[#8B1E22]' : 'bg-gray-200'
                  }`}
                  aria-label={`Toggle ${title}`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences[key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full btn-primary mt-6 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <BellOff className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#6B5344] mt-4">
            You can unsubscribe from any email at any time using the link in the email footer.
          </p>
        </div>
      </div>
    </div>
  )
}

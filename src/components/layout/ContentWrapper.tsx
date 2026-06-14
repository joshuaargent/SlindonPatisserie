'use client'

import { usePathname } from 'next/navigation'

const PADDED_PAGES = ['/products', '/careers']

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const needsPadding = PADDED_PAGES.some(page => pathname.startsWith(page))
  
  return (
    <main className={`flex-1${needsPadding ? ' pt-16' : ''}`}>
      {children}
    </main>
  )
}
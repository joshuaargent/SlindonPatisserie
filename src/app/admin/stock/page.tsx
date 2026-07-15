'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StockPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to products page - stock management is handled there
    router.replace('/admin/products')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-[#8B1E22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#6B5344]">Redirecting to Products...</p>
      </div>
    </div>
  )
}

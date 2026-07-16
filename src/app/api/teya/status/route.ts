import { NextResponse } from 'next/server'
import { teyaConfig } from '@/lib/teya'

export async function GET() {
  const configured = !!(
    teyaConfig.apiKey &&
    teyaConfig.merchantId &&
    teyaConfig.apiUrl
  )

  return NextResponse.json({
    configured,
    merchantId: teyaConfig.merchantId ? '***' + teyaConfig.merchantId.slice(-4) : null,
  })
}

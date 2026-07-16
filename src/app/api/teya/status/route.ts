import { NextResponse } from 'next/server'
import { teyaConfig } from '@/lib/teya'

export async function GET() {
  const configured = !!(
    teyaConfig.clientId &&
    teyaConfig.clientSecret &&
    teyaConfig.storeId
  )

  return NextResponse.json({
    configured,
    clientId: teyaConfig.clientId ? '***' + teyaConfig.clientId.slice(-8) : null,
    storeId: teyaConfig.storeId ? '***' + teyaConfig.storeId.slice(-8) : null,
  })
}

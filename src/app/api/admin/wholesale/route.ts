import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? 'all'

  const { createAdminClient } = await import('@/lib/supabase/server')
  const supabase = createAdminClient()

  let query = supabase
    .from('WholesaleEnquiry')
    .select('*')
    .order('"createdAt"', { ascending: false })

  if (status !== 'all') {
    query = query.eq('status', status.toUpperCase())
  }

  const { data, error } = await query

  if (error) {
    console.error('Wholesale fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch wholesale enquiries' }, { status: 500 })
  }

  return NextResponse.json({ enquiries: data ?? [] })
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const body = await request.json()
  const { id, status, note } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
  }

  const { createAdminClient } = await import('@/lib/supabase/server')
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('WholesaleEnquiry')
    .update({ status: status.toUpperCase(), note: note ?? null, "updatedAt": new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Wholesale update error:', error)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }

  return NextResponse.json({ enquiry: data })
}

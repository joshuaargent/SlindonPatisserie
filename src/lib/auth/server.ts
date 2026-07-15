import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * Returns the authenticated user from the session cookie, or null.
 */
export async function getAuthUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Checks the request is from an authenticated admin.
 * Returns null on success, or a NextResponse on failure.
 */
export async function requireAdmin(_request?: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin role in database
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('User')
    .select('role')
    .eq('email', user.email)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

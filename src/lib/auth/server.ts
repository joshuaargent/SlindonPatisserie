import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

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

  // Check admin role in database using authId
  const { data: profile } = await supabaseAdmin
    .from('User')
    .select('role')
    .eq('authId', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden — admin access required' },
      { status: 403 }
    )
  }

  return null
}

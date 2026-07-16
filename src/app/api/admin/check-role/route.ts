import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false }, { status: 200 })
    }

    // Check if user has admin role using authId
    const { data: userRecord } = await supabaseAdmin
      .from('User')
      .select('role')
      .eq('authId', user.id)
      .maybeSingle()

    return NextResponse.json({
      isAdmin: userRecord?.role?.toUpperCase() === 'ADMIN',
    })
  } catch (error) {
    console.error('Error checking admin role:', error)
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }
}

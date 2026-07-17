import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  // Check admin auth
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('User')
      .select('id, email, name, phone, role, isActive, createdAt')
      .order('createdAt', { ascending: false })

    if (role && role !== 'all') {
      query = query.eq('role', role.toUpperCase())
    }

    const { data: users, error } = await query

    if (error) throw error

    // Filter by search if provided (client-side)
    let filteredUsers = users || []
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower) ||
          u.phone?.includes(search)
      )
    }

    return NextResponse.json({ users: filteredUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  // Check admin auth
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, role, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    if (role !== undefined) updates.role = role.toUpperCase()
    if (isActive !== undefined) updates.isActive = isActive
    updates.updatedAt = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('User')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

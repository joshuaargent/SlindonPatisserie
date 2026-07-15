import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth/server'

// PATCH /api/admin/reviews/[id] - Update review status or add reply
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const { status, reply } = body

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status
    }

    if (reply !== undefined) {
      updateData.reply = reply
      if (reply) {
        updateData.repliedAt = new Date().toISOString()
      }
    }

    const { data: review, error } = await supabaseAdmin
      .from('Review')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        User:userId (name, email)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

// DELETE /api/admin/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('Review')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
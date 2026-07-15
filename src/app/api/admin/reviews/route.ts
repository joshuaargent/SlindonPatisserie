import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth/server'

// GET /api/admin/reviews - Get all reviews (admin only)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('Review')
      .select(`
        *,
        User:userId (name, email)
      `)
      .order('createdAt', { ascending: false })

    if (error) throw error

    // Transform to flatten user
    const transformedReviews = reviews?.map(r => ({
      id: r.id,
      userId: r.userId,
      user: { name: (r.User as any)?.name, email: (r.User as any)?.email },
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      status: r.status,
      reply: r.reply,
      repliedAt: r.repliedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))

    return NextResponse.json({ reviews: transformedReviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
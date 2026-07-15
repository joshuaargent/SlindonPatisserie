import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/reviews - Get all reviews (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper admin auth check
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: reviews, error } = await supabaseAdmin
      .from('Review')
      .select(`
        *,
        User:userId (name, email)
      `)
      .orderBy('createdAt', { ascending: false })

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
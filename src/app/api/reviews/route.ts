import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth/server'

// GET /api/reviews - Get approved reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createAdminClient()
    const { data: reviews, error, count } = await supabase
      .from('Review')
      .select(`
        *,
        User:userId (name)
      `, { count: 'exact' })
      .eq('status', 'APPROVED')
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const transformedReviews = reviews?.map((r: Record<string, unknown>) => ({
      id: r.id,
      userId: r.userId,
      user: { name: (r.User as any)?.name },
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      status: r.status,
      reply: r.reply,
      repliedAt: r.repliedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))

    return NextResponse.json({ reviews: transformedReviews, total: count || 0 })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { rating, title, comment } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check if user has completed an order
    const { data: orders } = await supabase
      .from('Order')
      .select('id')
      .eq('userId', user.id)
      .in('status', ['READY', 'COMPLETED'])
      .limit(1)

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'You can only review after completing a pickup' },
        { status: 403 }
      )
    }

    const { data: review, error } = await supabase
      .from('Review')
      .insert({
        userId: user.id,
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
        status: 'PENDING',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: 'Review submitted successfully! It will be visible after approval.',
      review,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/reviews - Get approved reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: reviews, error, count } = await supabaseAdmin
      .from('Review')
      .select(`
        *,
        User:userId (name)
      `, { count: 'exact' })
      .eq('status', 'APPROVED')
      .orderBy('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Transform to flatten user
    const transformedReviews = reviews?.map(r => ({
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

// POST /api/reviews - Submit a new review (placeholder - needs auth integration)
export async function POST(request: NextRequest) {
  try {
    // TODO: Integrate with Supabase Auth for user session
    // For now, require userId in request body
    const body = await request.json()
    const { userId, rating, title, comment } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      )
    }

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

    // Check if user has completed an order
    const { data: orders } = await supabaseAdmin
      .from('Order')
      .select('id')
      .eq('userId', userId)
      .in('status', ['READY', 'COMPLETED'])
      .limit(1)

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'You can only review after completing a pickup' },
        { status: 403 }
      )
    }

    const { data: review, error } = await supabaseAdmin
      .from('Review')
      .insert({
        userId,
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
        status: 'PENDING', // Reviews need approval
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
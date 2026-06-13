'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/reviews - Get approved reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const reviews = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.review.count({
      where: { status: 'APPROVED' },
    })

    return NextResponse.json({ reviews, total })
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
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      )
    }

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

    // Check if user has completed an order (they can only review after ordering)
    const hasCompletedOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['READY', 'COMPLETED'] },
      },
    })

    if (!hasCompletedOrder) {
      return NextResponse.json(
        { error: 'You can only review after completing a pickup' },
        { status: 403 }
      )
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
        status: 'PENDING', // Reviews need approval
      },
    })

    return NextResponse.json({ 
      message: 'Review submitted successfully! It will be visible after approval.',
      review 
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
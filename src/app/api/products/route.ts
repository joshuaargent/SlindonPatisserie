import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/products - List all products with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const available = searchParams.get('available')
    const includeWholesale = searchParams.get('includeWholesale') === 'true'

    const where: Record<string, unknown> = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (available === 'true') {
      where.available = true
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        retailPrice: true,
        wholesalePrice: includeWholesale,
        image: true,
        available: true,
        leadTimeDays: true,
        availability: true,
        madeAtFactoryA: true,
        madeAtFactoryB: true,
      },
    })

    // Get unique categories for filters
    const categories = await prisma.product.findMany({
      select: { categoryId: true, category: true },
      distinct: ['categoryId'],
      orderBy: { category: { name: 'asc' } },
    })

    return NextResponse.json({
      products,
      categories: categories.map(c => c.category),
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        category: { connect: { id: body.categoryId } },
        retailPrice: body.retailPrice,
        wholesalePrice: body.wholesalePrice,
        image: body.image,
        available: body.available ?? true,
        leadTimeDays: body.leadTimeDays || 1,
        availability: body.availability || 'RETAIL',
        madeAtFactoryA: body.madeAtFactoryA ?? true,
        madeAtFactoryB: body.madeAtFactoryB ?? false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
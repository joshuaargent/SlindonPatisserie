import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth/server'

// GET /api/products - List all products with optional filters (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const available = searchParams.get('available')
    const includeWholesale = searchParams.get('includeWholesale') === 'true'

    let query = supabaseAdmin
      .from('Product')
      .select(`
        id,
        name,
        description,
        categoryId,
        retailPrice,
        wholesalePrice,
        image,
        available,
        leadTimeDays,
        availability,
        madeAtFactoryA,
        madeAtFactoryB,
        Category:categoryId (id, name, slug)
      `)
      .order('name', { ascending: true })

    if (category && category !== 'all') {
      query = query.eq('categoryId', category)
    }

    if (available === 'true') {
      query = query.eq('available', true)
    }

    const { data: products, error } = await query

    if (error) throw error

    // Transform products to flatten category
    const transformedProducts = products?.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      categoryId: p.categoryId,
      category: p.Category,
      retailPrice: p.retailPrice,
      wholesalePrice: includeWholesale ? p.wholesalePrice : null,
      image: p.image,
      available: p.available,
      leadTimeDays: p.leadTimeDays,
      availability: p.availability,
      madeAtFactoryA: p.madeAtFactoryA,
      madeAtFactoryB: p.madeAtFactoryB,
    }))

    // Get unique categories
    const { data: categories } = await supabaseAdmin
      .from('Category')
      .select('id, name, slug')
      .eq('isActive', true)
      .order('sortOrder', { ascending: true })

    return NextResponse.json({
      products: transformedProducts,
      categories: categories || [],
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
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()

    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-')

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .insert({
        name: body.name,
        slug,
        description: body.description,
        categoryId: body.categoryId,
        retailPrice: body.retailPrice,
        wholesalePrice: body.wholesalePrice,
        image: body.image,
        available: body.available ?? true,
        leadTimeDays: body.leadTimeDays || 1,
        availability: body.availability || 'RETAIL',
        madeAtFactoryA: body.madeAtFactoryA ?? true,
        madeAtFactoryB: body.madeAtFactoryB ?? false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
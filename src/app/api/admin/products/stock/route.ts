import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/products - Get all products for admin
export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper admin auth check with Supabase Auth
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('Product')
      .select(`
        *,
        Category:categoryId (id, name)
      `)
      .orderBy('name', { ascending: true })

    if (categoryId) {
      query = query.eq('categoryId', categoryId)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: products, error } = await query

    if (error) throw error

    // Transform products with category info
    const transformedProducts = products?.map(product => ({
      ...product,
      category: (product.Category as any)?.name || 'Unknown',
    })) || []

    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      categoryId,
      retailPrice,
      wholesalePrice,
      image,
      available = true,
      leadTimeDays = 1,
      availability = 'RETAIL',
      madeAtFactoryA = true,
      madeAtFactoryB = false,
      featured = false,
    } = body

    // Validation
    if (!name || !description || !categoryId || !retailPrice) {
      return NextResponse.json(
        { error: 'Name, description, category, and price are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .insert({
        name,
        slug: productSlug,
        description,
        categoryId,
        retailPrice: parseFloat(retailPrice),
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        image: image || null,
        available,
        leadTimeDays,
        availability,
        madeAtFactoryA,
        madeAtFactoryB,
        featured,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/products - Update a product
export async function PATCH(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Parse numeric fields
    if (updates.retailPrice) updates.retailPrice = parseFloat(updates.retailPrice)
    if (updates.wholesalePrice) updates.wholesalePrice = parseFloat(updates.wholesalePrice)

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
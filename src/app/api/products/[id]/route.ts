import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth/server'

// GET /api/products/[id] - Get single product (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .select(`
        *,
        Category:categoryId (id, name, slug, description)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - Update product (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .update({
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        retailPrice: body.retailPrice,
        wholesalePrice: body.wholesalePrice,
        image: body.image,
        available: body.available,
        leadTimeDays: body.leadTimeDays,
        availability: body.availability,
        madeAtFactoryA: body.madeAtFactoryA,
        madeAtFactoryB: body.madeAtFactoryB,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params

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
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  // Check admin auth
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { data: categories, error } = await supabaseAdmin
      .from('Category')
      .select('*')
      .order('sortOrder', { ascending: true })

    if (error) throw error

    return NextResponse.json({ categories: categories || [] })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Check admin auth
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, slug, description, image, sortOrder } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Get max sortOrder if not provided
    let order = sortOrder
    if (order === undefined) {
      const { data: maxOrder } = await supabaseAdmin
        .from('Category')
        .select('sortOrder')
        .order('sortOrder', { ascending: false })
        .limit(1)
        .single()
      order = (maxOrder?.sortOrder || 0) + 1
    }

    const { data: category, error } = await supabaseAdmin
      .from('Category')
      .insert({
        name,
        slug,
        description: description || null,
        image: image || null,
        sortOrder: order,
        isActive: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  // Check admin auth
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, name, slug, description, image, sortOrder, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() }
    if (name !== undefined) updates.name = name
    if (slug !== undefined) updates.slug = slug
    if (description !== undefined) updates.description = description
    if (image !== undefined) updates.image = image
    if (sortOrder !== undefined) updates.sortOrder = sortOrder
    if (isActive !== undefined) updates.isActive = isActive

    const { data: category, error } = await supabaseAdmin
      .from('Category')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  // Check admin auth
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }

    // Check if category has products
    const { data: products } = await supabaseAdmin
      .from('Product')
      .select('id')
      .eq('categoryId', id)
      .limit(1)

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Remove or reassign products first.' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('Category')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

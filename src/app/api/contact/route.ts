import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'

// Contact form categories
export const CONTACT_CATEGORIES = {
  GENERAL: 'general',
  ALLERGY: 'allergy',
  ORDER: 'order',
  WHOLESALE: 'wholesale',
  FRANCHISE: 'franchise',
  CAREERS: 'careers',
  COMPLAINT: 'complaint',
  OTHER: 'other',
} as const

type ContactCategory = typeof CONTACT_CATEGORIES[keyof typeof CONTACT_CATEGORIES]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, category, subject, message } = body

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate category if provided
    const validCategories = Object.values(CONTACT_CATEGORIES)
    const contactCategory = category && validCategories.includes(category)
      ? category as ContactCategory
      : CONTACT_CATEGORIES.GENERAL

    // Create enquiry in database
    const { data: enquiry, error } = await supabaseAdmin
      .from('ContactEnquiry')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        category: contactCategory,
        message: message.trim(),
        status: 'NEW',
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Send email notifications via Resend (when API key is configured)
    // await sendContactNotification({ ... })
    // await sendAutoReply({ ... })

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will be in touch soon.',
      id: enquiry.id,
      category: contactCategory,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Only allow access in development or for admin users
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const { data: enquiries, error } = await supabaseAdmin
      .from('ContactEnquiry')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json(enquiries || [])
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    )
  }
}
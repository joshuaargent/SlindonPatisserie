import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import { Resend } from 'resend'

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

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Slindon Patisserie <noreply@slindonpatisserie.co.uk>'
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@slindonpatisserie.co.uk'

async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  category: string
  message: string
  enquiryId: string
}) {
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email notification')
    return
  }

  const resend = new Resend(RESEND_API_KEY)

  const categoryLabel = data.category.charAt(0).toUpperCase() + data.category.slice(1)

  try {
    // Send notification to business
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `[${categoryLabel}] New Contact: ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Category:</strong> ${categoryLabel}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Enquiry ID: ${data.enquiryId}</small></p>
      `,
    })

    // Send auto-reply to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      subject: 'We received your message - Slindon Patisserie',
      html: `
        <h2>Thank you for contacting Slindon Patisserie</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for your message. We have received your enquiry and will respond within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <p>We look forward to helping you!</p>
        <hr>
        <p><strong>Slindon Patisserie</strong><br>
        Freshly baked with love<br>
        <a href="https://slindonpatisserie.co.uk">slindonpatisserie.co.uk</a></p>
      `,
    })

    console.log('Contact emails sent successfully')
  } catch (error) {
    console.error('Failed to send contact emails:', error)
    // Don't throw - email failure shouldn't break the form submission
  }
}

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

    // Send email notifications
    await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      category: contactCategory,
      message: message.trim(),
      enquiryId: enquiry.id,
    })

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
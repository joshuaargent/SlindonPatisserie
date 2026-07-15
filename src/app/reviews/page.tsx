'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Send, ArrowLeft, CheckCircle } from 'lucide-react'
import { useSupabaseUser } from '@/components/providers/SupabaseProvider'
import { useRouter } from 'next/navigation'

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string
  createdAt: string
  user: {
    name: string
  }
}

export default function ReviewsPage() {
  const { user } = useSupabaseUser()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Form state
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?limit=20')
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, comment }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit review')
        return
      }

      setSubmitted(true)
      setRating(5)
      setTitle('')
      setComment('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5'
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={`${sizeClass} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            <Star
              className={`${
                star <= (interactive ? (hoverRating || rating) : rating)
                  ? 'fill-[#D0A246] text-[#D0A246]'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <section className="bg-[#8B1E22] text-[#F7F2E9] py-12">
        <div className="container">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#D0A246] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#F7F2E9] mb-4">Customer Reviews</h1>
          <p className="text-[#F7F2E9]/85 text-lg max-w-2xl">
            See what our customers say about their experience with Slindon Patisserie.
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Rating Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#8B1E22]">{averageRating}</p>
                  <div className="mt-2 flex justify-center">
                    {renderStars(Math.round(parseFloat(averageRating)))}
                  </div>
                  <p className="text-[#6B5344] text-sm mt-1">{reviews.length} reviews</p>
                </div>
                <div className="h-16 w-px bg-[#E8DDD0]" />
                <div className="flex-1">
                  <p className="text-[#6B5344]">
                    Our customers love our handmade patisserie. From croissants to celebration cakes, 
                    every item is crafted with care using traditional recipes.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-[#E8DDD0]" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#E8DDD0] rounded w-32 mb-2" />
                        <div className="h-3 bg-[#E8DDD0] rounded w-24" />
                      </div>
                    </div>
                    <div className="h-4 bg-[#E8DDD0] rounded w-full mb-2" />
                    <div className="h-4 bg-[#E8DDD0] rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Star className="h-16 w-16 mx-auto text-[#D0A246] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-2">No Reviews Yet</h3>
                <p className="text-[#6B5344]">
                  Be the first to share your experience with Slindon Patisserie!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center">
                          <span className="text-[#8B1E22] font-bold text-lg">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#3A2C2A]">{review.user.name}</p>
                          <p className="text-sm text-[#6B5344]">
                            {new Date(review.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-[#3A2C2A] mb-2">{review.title}</h4>
                    )}
                    <p className="text-[#6B5344] leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Review Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-4">
                Share Your Experience
              </h3>
              
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-[#6B5344] mb-4">
                    Please sign in to leave a review
                  </p>
                  <Link href="/login" className="btn-primary inline-flex">
                    Sign In
                  </Link>
                </div>
              ) : submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h4 className="font-semibold text-[#3A2C2A] mb-2">Thank You!</h4>
                  <p className="text-[#6B5344] mb-4">
                    Your review has been submitted and will be visible after approval.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#8B1E22] hover:text-[#D0A246] font-medium"
                  >
                    Write another review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-4">
                      {renderStars(rating, true, 'lg')}
                      <span className="text-[#6B5344] text-sm">
                        {rating === 5 ? 'Excellent!' : 
                         rating === 4 ? 'Great' : 
                         rating === 3 ? 'Good' : 
                         rating === 2 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Review Title (optional)
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum up your experience"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={4}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-[#6B5344] mt-1">
                      {comment.length}/10 minimum characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || comment.trim().length < 10}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {submitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#6B5344] text-center">
                    Reviews are moderated before appearing on the site.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
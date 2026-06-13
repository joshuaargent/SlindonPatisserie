'use client'

import { useState, useEffect } from 'react'
import { Star, Check, X, Clock, Reply, Trash2 } from 'lucide-react'

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string
  status: string
  reply: string | null
  repliedAt: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [processing, setProcessing] = useState<string | null>(null)
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      if (res.ok) {
        setReviews(reviews.map(r => 
          r.id === id ? { ...r, status } : r
        ))
      }
    } catch (err) {
      console.error('Error updating review:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleReply = async (reviewId: string) => {
    const reply = replyText[reviewId]
    if (!reply?.trim()) return

    setProcessing(reviewId)
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply }),
      })
      
      if (res.ok) {
        setReviews(reviews.map(r => 
          r.id === reviewId ? { ...r, reply, repliedAt: new Date().toISOString() } : r
        ))
        setReplyText({ ...replyText, [reviewId]: '' })
      }
    } catch (err) {
      console.error('Error replying to review:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    setProcessing(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id))
      }
    } catch (err) {
      console.error('Error deleting review:', err)
    } finally {
      setProcessing(null)
    }
  }

  const filteredReviews = filter === 'ALL' 
    ? reviews 
    : reviews.filter(r => r.status === filter)

  const statusCounts = {
    ALL: reviews.length,
    PENDING: reviews.filter(r => r.status === 'PENDING').length,
    APPROVED: reviews.filter(r => r.status === 'APPROVED').length,
    REJECTED: reviews.filter(r => r.status === 'REJECTED').length,
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-[#D0A246] text-[#D0A246]'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A2C2A]">Customer Reviews</h1>
          <p className="text-[#6B5344] mt-1">Manage and moderate customer reviews</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setFilter('ALL')}
          className={`bg-white rounded-xl p-4 text-left border-2 transition-all ${
            filter === 'ALL' ? 'border-[#8B1E22] shadow-md' : 'border-transparent'
          }`}
        >
          <p className="text-2xl font-bold text-[#8B1E22]">{statusCounts.ALL}</p>
          <p className="text-sm text-[#6B5344]">Total Reviews</p>
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`bg-white rounded-xl p-4 text-left border-2 transition-all ${
            filter === 'PENDING' ? 'border-[#D0A246] shadow-md' : 'border-transparent'
          }`}
        >
          <p className="text-2xl font-bold text-[#D0A246]">{statusCounts.PENDING}</p>
          <p className="text-sm text-[#6B5344]">Pending</p>
        </button>
        <button
          onClick={() => setFilter('APPROVED')}
          className={`bg-white rounded-xl p-4 text-left border-2 transition-all ${
            filter === 'APPROVED' ? 'border-green-500 shadow-md' : 'border-transparent'
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{statusCounts.APPROVED}</p>
          <p className="text-sm text-[#6B5344]">Approved</p>
        </button>
        <button
          onClick={() => setFilter('REJECTED')}
          className={`bg-white rounded-xl p-4 text-left border-2 transition-all ${
            filter === 'REJECTED' ? 'border-red-500 shadow-md' : 'border-transparent'
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{statusCounts.REJECTED}</p>
          <p className="text-sm text-[#6B5344]">Rejected</p>
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-[#6B5344]">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Star className="h-16 w-16 mx-auto text-[#D0A246]/30 mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#3A2C2A] mb-2">No Reviews Found</h3>
          <p className="text-[#6B5344]">
            {filter === 'ALL' 
              ? 'No reviews have been submitted yet.'
              : `No ${filter.toLowerCase()} reviews.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center">
                    <span className="text-[#8B1E22] font-bold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#3A2C2A]">{review.user.name}</p>
                    <p className="text-sm text-[#6B5344]">{review.user.email}</p>
                    <p className="text-xs text-[#6B5344] mt-1">
                      {new Date(review.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {renderStars(review.rating)}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'APPROVED' 
                      ? 'bg-green-100 text-green-700'
                      : review.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>

              {review.title && (
                <h4 className="font-semibold text-[#3A2C2A] mb-2">{review.title}</h4>
              )}
              <p className="text-[#6B5344] leading-relaxed mb-4">{review.comment}</p>

              {/* Reply */}
              {review.reply ? (
                <div className="bg-[#F7F2E9] rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="h-4 w-4 text-[#D0A246]" />
                    <span className="text-sm font-medium text-[#3A2C2A]">Our Response</span>
                    <span className="text-xs text-[#6B5344]">
                      {new Date(review.repliedAt!).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <p className="text-[#6B5344] text-sm">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={replyText[review.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                    placeholder="Write a reply..."
                    className="flex-1 px-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246]"
                  />
                  <button
                    onClick={() => handleReply(review.id)}
                    disabled={processing === review.id || !replyText[review.id]?.trim()}
                    className="btn-secondary-sm"
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                </div>
              )}

              {/* Actions */}
              {review.status === 'PENDING' && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E8DDD0]">
                  <button
                    onClick={() => handleStatusUpdate(review.id, 'APPROVED')}
                    disabled={processing === review.id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(review.id, 'REJECTED')}
                    disabled={processing === review.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={processing === review.id}
                  className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
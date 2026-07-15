'use client'

import { useEffect, useState } from 'react'
import { Building2, Mail, Phone, Clock, CheckCircle, XCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react'

interface WholesaleEnquiry {
  id: string
  businessName: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  note: string | null
  userId: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  NEW: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50' },
  REVIEWING: { label: 'Reviewing', color: 'text-amber-700', bg: 'bg-amber-50' },
  APPROVED: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-50' },
  REJECTED: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function AdminWholesalePage() {
  const [enquiries, setEnquiries] = useState<WholesaleEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')

  useEffect(() => {
    fetchEnquiries()
  }, [filter])

  async function fetchEnquiries() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/wholesale?status=${filter}`)
      if (!res.ok) throw new Error('Failed to load enquiries')
      const data = await res.json()
      setEnquiries(data.enquiries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/wholesale', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, note: noteInput || undefined }),
      })
      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...data.enquiry } : e))
      setExpandedId(null)
      setNoteInput('')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'NEW').length,
    reviewing: enquiries.filter(e => e.status === 'REVIEWING').length,
    approved: enquiries.filter(e => e.status === 'APPROVED').length,
    rejected: enquiries.filter(e => e.status === 'REJECTED').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#8B1E22]/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#8B1E22]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Wholesale Applications</h1>
        </div>
        <p className="text-[#6B5344]">Review and approve wholesale partnership applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'NEW', label: 'New' },
          { key: 'REVIEWING', label: 'Reviewing' },
          { key: 'APPROVED', label: 'Approved' },
          { key: 'REJECTED', label: 'Rejected' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-[#8B1E22] text-white'
                : 'bg-white text-[#6B5344] hover:bg-[#F7F2E9] border border-gray-200'
            }`}
          >
            {f.label}
            {counts[f.key as keyof typeof counts] > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === f.key ? 'bg-white/20' : 'bg-[#F7F2E9]'
              }`}>
                {counts[f.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#8B1E22] animate-spin" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-[#6B5344] mx-auto mb-3" />
          <p className="text-[#6B5344]">No wholesale enquiries found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map(enquiry => {
            const statusCfg = STATUS_CONFIG[enquiry.status] ?? { label: enquiry.status, color: 'text-gray-700', bg: 'bg-gray-50' }
            const isExpanded = expandedId === enquiry.id

            return (
              <div key={enquiry.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#F7F2E9] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#8B1E22]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#3A2C2A]">{enquiry.businessName}</h3>
                        <p className="text-sm text-[#6B5344]">{enquiry.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-[#6B5344]">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{enquiry.email}</span>
                          {enquiry.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{enquiry.phone}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(enquiry.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
                        className="p-2 text-[#6B5344] hover:text-[#3A2C2A] hover:bg-[#F7F2E9] rounded-lg transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      <div>
                        <p className="text-xs font-medium text-[#6B5344] uppercase tracking-wider mb-1">Message</p>
                        <p className="text-[#3A2C2A] text-sm">{enquiry.message}</p>
                      </div>
                      {enquiry.note && (
                        <div>
                          <p className="text-xs font-medium text-[#6B5344] uppercase tracking-wider mb-1">Admin Note</p>
                          <p className="text-[#3A2C2A] text-sm">{enquiry.note}</p>
                        </div>
                      )}

                      {/* Action panel */}
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <input
                          type="text"
                          placeholder="Add a note (optional)"
                          value={noteInput}
                          onChange={e => setNoteInput(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
                        />
                        <div className="flex gap-2">
                          {enquiry.status === 'NEW' && (
                            <button
                              onClick={() => updateStatus(enquiry.id, 'REVIEWING')}
                              disabled={updating === enquiry.id}
                              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
                            >
                              {updating === enquiry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                              Mark Reviewing
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(enquiry.id, 'APPROVED')}
                            disabled={updating === enquiry.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {updating === enquiry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(enquiry.id, 'REJECTED')}
                            disabled={updating === enquiry.id}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                          >
                            {updating === enquiry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

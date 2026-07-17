'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Shield, CheckCircle, XCircle, Loader2, Mail, Phone } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: string
}

const roleColors: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: 'bg-red-100', text: 'text-red-700' },
  WHOLESALE: { bg: 'bg-purple-100', text: 'text-purple-700' },
  CUSTOMER: { bg: 'bg-blue-100', text: 'text-blue-700' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [filterRole])

  async function fetchUsers() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterRole !== 'all') params.set('role', filterRole)
      
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateUser(id: string, updates: { role?: string; isActive?: boolean }) {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setUsers(users.map(u => u.id === id ? { ...u, ...data.user } : u))
      }
    } catch (err) {
      console.error('Failed to update user:', err)
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsers = users.filter(user => {
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone?.includes(search)
      )
    }
    return true
  })

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'ADMIN').length,
    wholesale: users.filter(u => u.role === 'WHOLESALE').length,
    customer: users.filter(u => u.role === 'CUSTOMER').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3A2C2A]">Users</h1>
        <p className="text-[#6B5344] mt-1">Manage customer accounts and wholesale permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'all', label: 'All Users' },
          { key: 'admin', label: 'Admins' },
          { key: 'wholesale', label: 'Wholesale' },
          { key: 'customer', label: 'Customers' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterRole(f.key)}
            className={`bg-white rounded-xl p-4 text-left border-2 transition-all ${
              filterRole === f.key ? 'border-[#8B1E22] shadow-md' : 'border-transparent'
            }`}
          >
            <p className="text-2xl font-bold text-[#8B1E22]">{counts[f.key as keyof typeof counts]}</p>
            <p className="text-sm text-[#6B5344]">{f.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5344]" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22]"
          />
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B1E22] mx-auto mb-4" />
          <p className="text-[#6B5344]">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-[#6B5344] mx-auto mb-4" />
          <p className="text-[#6B5344]">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map(user => {
            const roleStyle = roleColors[user.role] || roleColors.CUSTOMER
            
            return (
              <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#D0A246]/20 flex items-center justify-center">
                      <span className="text-[#8B1E22] font-bold text-lg">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3A2C2A]">{user.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[#6B5344]">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B5344] mt-1">
                        Joined {new Date(user.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                      {user.role}
                    </span>
                    
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => updateUser(user.id, { role: 'ADMIN' })}
                        disabled={updating === user.id}
                        className="p-2 text-[#6B5344] hover:text-[#8B1E22] hover:bg-[#F7F2E9] rounded-lg transition-colors disabled:opacity-50"
                        title="Make Admin"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                      disabled={updating === user.id}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        user.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {updating === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.isActive ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
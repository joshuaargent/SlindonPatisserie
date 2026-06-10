import Link from 'next/link'
import { Users, Shield } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#2D1810]">Users</h1>
        <p className="text-[#5C4033] mt-1">Manage customer accounts and wholesale permissions</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl p-12 shadow-sm text-center">
        <div className="w-20 h-20 bg-[#FDF8F0] rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-[#5C4033]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2D1810] mb-2">
          User Management Coming Soon
        </h2>
        <p className="text-[#5C4033] max-w-md mx-auto mb-6">
          Full user management with role-based access control, wholesale approval workflow, 
          and order history is currently under development.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDF8F0] rounded-lg text-[#5C4033]">
          <Shield className="w-5 h-5" />
          <span>Protected by NextAuth authentication</span>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-[#2D1810] mb-2">Customer Accounts</h3>
          <p className="text-sm text-[#5C4033]">View and manage customer profiles, order history, and preferences.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-[#2D1810] mb-2">Wholesale Approval</h3>
          <p className="text-sm text-[#5C4033]">Review and approve wholesale applications with business verification.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-[#2D1810] mb-2">Role Management</h3>
          <p className="text-sm text-[#5C4033]">Assign admin, staff, and delivery roles with appropriate permissions.</p>
        </div>
      </div>
    </div>
  )
}
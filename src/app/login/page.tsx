'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
      } else {
        router.push('/account')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9] flex flex-col">
      {/* Header */}
      <div className="bg-[#8B1E22] text-[#F7F2E9] py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#8B1E22]">Slindon Patisserie</h1>
            <p className="text-[#6B5344] mt-2">Welcome back</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#8B1E22] mb-6">Sign In</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5344]" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-[#6B5344] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#3A2C2A] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5344]" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-[#6B5344] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0A246] focus:border-transparent"
                    placeholder="Your password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-lg px-8 py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

                        {/* Demo Accounts */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-[#F7F2E9] rounded-lg">
                <p className="text-sm text-[#6B5344] font-semibold mb-2">Development Only:</p>
                <div className="text-xs text-[#6B5344] space-y-1">
                  <p>Admin: admin@slindon.co.uk / admin123</p>
                </div>
              </div>
            )}

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-[#6B5344]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#8B1E22] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
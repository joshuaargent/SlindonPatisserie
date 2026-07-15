'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  user_metadata?: {
    name?: string
  }
}

interface SupabaseContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user as User | null)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user as User | null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user as User | null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    router.refresh()
    return {}
  }

  const signUp = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) return { error: error.message }
    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <SupabaseContext.Provider value={{ user, loading, signIn, signUp, signOut, refresh }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabaseUser() {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabaseUser must be used within SupabaseProvider')
  return ctx
}

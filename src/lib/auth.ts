// Auth utilities using Supabase
// Note: NextAuth has been removed in favor of Supabase Auth

import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const { data: user, error } = await supabaseAdmin
    .from('User')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !user) {
    return null
  }

  if (!user.isActive) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
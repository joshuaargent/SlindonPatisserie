import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// For demo purposes - in production use Prisma
const demoUsers = [
  {
    id: '1',
    email: 'customer@slindon.co.uk',
    password: 'customer123',
    name: 'Demo Customer',
    role: 'customer',
  },
  {
    id: '2',
    email: 'wholesale@slindon.co.uk',
    password: 'wholesale123',
    name: 'Demo Wholesale',
    role: 'wholesale',
  },
  {
    id: '3',
    email: 'admin@slindon.co.uk',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user - in production this would be a database query
        const user = demoUsers.find((u) => u.email === credentials.email)

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
})

export { handler as GET, handler as POST }
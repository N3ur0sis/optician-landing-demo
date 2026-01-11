import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

// Minimal Edge-compatible auth config for middleware
// This config doesn't include the authorize function since that requires Node.js runtime
export const authConfig = {
  providers: [], // Providers are configured in lib/auth.ts
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPage = nextUrl.pathname.startsWith('/admin')
      const isOnLoginPage = nextUrl.pathname === '/admin/login'
      
      if (isOnAdminPage && !isOnLoginPage) {
        return isLoggedIn
      } else if (isOnLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig

export const { auth } = NextAuth(authConfig)

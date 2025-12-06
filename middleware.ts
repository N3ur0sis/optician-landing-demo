import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isOnLoginPage = req.nextUrl.pathname === '/admin/login'

  // If on admin page (but not login) and not logged in, redirect to login
  if (isOnAdminPage && !isOnLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // If on login page and already logged in, redirect to dashboard
  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*']
}

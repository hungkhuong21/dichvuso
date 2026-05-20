import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if accessing /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if token exists
    const token = request.cookies.get('admin_token')?.value || localStorage.getItem?.('admin_token')

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

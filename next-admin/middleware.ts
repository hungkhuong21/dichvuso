import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if accessing /admin routes (except /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('/admin/login')) {
    // Check if token exists in cookies or headers
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

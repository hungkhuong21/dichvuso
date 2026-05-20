import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // chỉ xử lý route admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('dvs_access_token')?.value;
  const userRaw = req.cookies.get('dvs_user')?.value;

  console.log('[proxy] pathname:', pathname);

  // chưa login → về login
  if (!token || !userRaw) {
    console.log('[proxy] → redirect: missing token or user');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const user = JSON.parse(decodeURIComponent(userRaw));
    console.log('[proxy] user.role:', user?.role);

    // ❗ không phải admin
    if (user?.role !== 'admin') {
      console.log('[proxy] → redirect: not admin');
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (e) {
    console.log('[proxy] → redirect: parse error');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('[proxy] → PASS');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
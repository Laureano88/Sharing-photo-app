import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // Proteger rutas de admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session && req.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (session && req.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}

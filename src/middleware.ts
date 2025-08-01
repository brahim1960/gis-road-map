import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from './types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const pathname = req.nextUrl.pathname
  
  try {
    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth/signin', '/auth/signup']
    const isPublicRoute = publicRoutes.includes(pathname)
    
    // Skip middleware for public routes and static files
    if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return res
    }
    
    // For protected routes, let the client handle authentication
    // This prevents server-side redirect loops

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/showcase']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // If accessing protected path without session, redirect to login
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If we have a session, check role-based access
  if (session) {
    // Get user role from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!error && userData) {
      const isAdmin = userData.role === 'admin'
      const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')
      const isShowcasePath = request.nextUrl.pathname.startsWith('/showcase')

      // Redirect non-admin users trying to access dashboard
      if (isDashboardPath && !isAdmin) {
        const redirectUrl = new URL('/showcase', request.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Optional: Redirect admin users from showcase to dashboard
      if (isShowcasePath && isAdmin) {
        const redirectUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return response
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth related pages (/auth/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
} 
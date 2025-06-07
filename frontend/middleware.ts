import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password", "/auth/verify-account"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/auth/verify-account/"))

  // If user is authenticated and trying to access a public route
  // 2. Check authentication via API
  let isAuthenticated = false
  let isAdmin = false
  try {
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`,
      {
        credentials: 'include',
      }
    )
    if (authResponse.ok) {
      isAuthenticated = true
      const userData = await authResponse.json()
      isAdmin = userData.is_staff
    }
  } catch (error) {
    // console.error("Auth check error:", error) // Uncomment for debugging now, commented to avoid unnecessary logs
    // Silently fail, ignoring errors, Since this is just an initial auth check
  }

  if (isAuthenticated) {
    try {

      // If user is authenticated and trying to access a public route, redirect to appropriate dashboard
      if (isPublicRoute && !(pathname === "/auth/signin")) {
        if (isAdmin) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // If user is authenticated and trying to access dashboard but is an admin
      if (pathname === "/dashboard") {
        if (isAdmin) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      }

      // Similarly, if a non-admin tries to access /admin, redirect to dashboard
      if (pathname === "/admin") {
        if (!isAdmin) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    } catch (error) {
      console.error("Error parsing auth data:", error)
      // Clear invalid cookies
      const response = NextResponse.next()
      response.cookies.delete("auth_session")
      response.cookies.delete("auth_refresh_session")
      return response
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov|avi|woff|woff2)$).*)",
  ],
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROUTES } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth tokens from cookies or localStorage (if available in middleware)
  const authTokens = request.cookies.get("auth_tokens")?.value
  const isAuthenticated = !!authTokens

  // Parse user data to check if admin (if available)
  let isAdmin = false
  try {
    const userData = request.cookies.get("auth_user")?.value
    if (userData) {
      const user = JSON.parse(userData)
      isAdmin = user.is_staff === true
    }
  } catch (error) {
    console.error("Error parsing user data in middleware:", error)
  }

  // Auth routes that should redirect to dashboard if already authenticated
  const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD]

  // Protected routes that require authentication
  const protectedRoutes = [ROUTES.DASHBOARD, ROUTES.PROFILE]

  // Admin routes that require admin privileges
  const adminRoutes = [ROUTES.ADMIN]

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(isAdmin ? ROUTES.ADMIN : ROUTES.DASHBOARD, request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(pathname)}`, request.url))
  }

  // Redirect non-admin users away from admin pages
  if (isAuthenticated && !isAdmin && adminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all auth routes
    "/auth/:path*",
    // Match all protected routes
    "/dashboard/:path*",
    "/profile/:path*",
    // Match all admin routes
    "/admin/:path*",
  ],
}

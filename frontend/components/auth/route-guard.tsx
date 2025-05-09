"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function RouteGuard({ children, requireAuth = false, requireAdmin = false }: RouteGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Authentication check
    const authCheck = () => {
      if (isLoading) return

      // If the route requires authentication and the user is not authenticated
      if (requireAuth && !isAuthenticated) {
        setAuthorized(false)
        router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
        return
      }

      // If the route requires admin privileges and the user is not an admin
      if (requireAdmin && !isAdmin) {
        setAuthorized(false)
        router.push("/dashboard")
        return
      }

      // If all checks pass, set authorized to true
      setAuthorized(true)
    }

    authCheck()
  }, [isAuthenticated, isAdmin, isLoading, requireAuth, requireAdmin, router, pathname])

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // If authorized, render children
  return authorized ? <>{children}</> : null
}

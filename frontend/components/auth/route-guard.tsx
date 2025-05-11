"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

type RouteGuardProps = {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function RouteGuard({ children, requireAuth = false, requireAdmin = false }: RouteGuardProps) {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Authentication check function
    const authCheck = () => {
      setIsChecking(true)

      // If no authentication is required, allow access
      if (!requireAuth) {
        setAuthorized(true)
        setIsChecking(false)
        return
      }

      // If authentication is required but user is not authenticated
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login")
        setAuthorized(false)
        router.push(`/auth/signin?redirect=${encodeURIComponent(pathname)}`)
        setIsChecking(false)
        return
      }

      // If admin access is required but user is not an admin
      if (requireAdmin && !isAdmin) {
        console.log("Not admin, redirecting to dashboard")
        setAuthorized(false)
        router.push("/dashboard") // Redirect to user dashboard
        setIsChecking(false)
        return
      }

      // If all checks pass, authorize access
      console.log("Authorization successful")
      setAuthorized(true)
      setIsChecking(false)
    }

    // Run auth check
    authCheck()

    // Add router event listener for route changes
    const handleRouteChange = () => authCheck()

    // Clean up event listener
    return () => {
      // If we had router events to listen to, we'd clean them up here
    }
  }, [isAuthenticated, isAdmin, pathname, requireAuth, requireAdmin, router])

  // Show loading or nothing while checking authentication
  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // If not authorized, show nothing (redirect should happen)
  if (!authorized) {
    return null
  }

  // If authorized, show children
  return <>{children}</>
}

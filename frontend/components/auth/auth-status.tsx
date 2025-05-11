"use client"

import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, User } from "lucide-react"
import Link from "next/link"

export function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <User className="h-5 w-5 mr-2 text-gray-500" />
        <span className="text-sm font-medium">
          {user?.first_name} {user?.last_name}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => logout()} className="text-gray-500 hover:text-gray-700">
        <LogOut className="h-4 w-4 mr-2" />
        <span>Logout</span>
      </Button>
    </div>
  )
}

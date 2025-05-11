"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  date_joined: string
  is_active: boolean
  is_staff: boolean
  profile?: {
    [key: string]: any
  }
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  socialLogin: (provider: string, token: string) => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  updateUser: (userData: Partial<User>) => Promise<void>
  loading: boolean
}

// Frontend Routes
const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/signin",
  SIGNUP: "/auth/signup",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADMIN: "/admin",
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setIsAuthenticated(true)
          setIsAdmin(userData.is_staff)
        } else {
          // Clear auth state if not authenticated
          setUser(null)
          setIsAuthenticated(false)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }

      // Get user data after successful login
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data")
      }

      const userData = await userResponse.json()
      setUser(userData)
      setIsAuthenticated(true)
      setIsAdmin(userData.is_staff)

      // Redirect based on user role
      if (userData.is_staff) {
        router.push(ROUTES.ADMIN)
      } else {
        router.push(ROUTES.DASHBOARD)
      }

      return userData
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  const socialLogin = async (provider: string, token: string) => {
    try {
      let endpoint = ""

      if (provider === "google") {
        endpoint = "/api/auth/social/google/"
      } else {
        throw new Error(`Unsupported provider: ${provider}`)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: token }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `${provider} login failed`)
      }

      // Get user data after successful login
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data")
      }

      const userData = await userResponse.json()
      setUser(userData)
      setIsAuthenticated(true)
      setIsAdmin(userData.is_staff)

      // Redirect based on user role
      if (userData.is_staff) {
        router.push(ROUTES.ADMIN)
      } else {
        router.push(ROUTES.DASHBOARD)
      }

      return userData
    } catch (error) {
      console.error("Social login error:", error)
      toast({
        title: "Social Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setIsAdmin(false)
      router.push(ROUTES.LOGIN)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update user")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error("Update user error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        socialLogin,
        isAuthenticated,
        isAdmin,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

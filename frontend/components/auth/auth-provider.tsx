"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
  _registrationSuccess?: boolean // Optional field to indicate registration success
}

type AuthContextType = {
  user: User | null
  register: (
    email: string,
    password1: string,
    password2: string,
    firstName: string,
    lastName: string
  ) => Promise<User | null>
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  socialLogin: (provider: string, params: Record<string, string>) => Promise<User | null>
  isAuthenticated: boolean
  isAdmin: boolean
  updateUser: (userData: Partial<User>) => Promise<User | null>
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
        // console.error("Auth check error:", error) // Uncomment for debugging, now commented to avoid unnecessary logs
        // Silently fail, ignoring errors as this is just an initial auth check
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const register = async (
    email: string,
    password1: string,
    password2: string,
    firstName: string,
    lastName: string
  ): Promise<User | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/registration/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password1,
          password2,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle validation errors specifically
        if (errorData.email || errorData.password1 || errorData.password2 || errorData.first_name || errorData.last_name) {
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      const requiresVerification = !data.user;

      if (requiresVerification) {
        // Case 1: Verification required - show success page
        router.push(`/auth/signup-success?verification=true`);
      } else {
        // Return the user data with a success flag
        return {
          ...data.user,
          _registrationSuccess: true
        };
      }

      return data.user || null;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
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
      // Let the component handle the error display
      throw error
    }
  }

  const socialLogin = async (provider: string, params: Record<string, string>): Promise<User | null> => {
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
        body: JSON.stringify(params),
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
      // Let the component handle the error display
      throw error
    }
  }

  const logout = async (): Promise<void> => {
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

  const updateUser = async (userData: Partial<User>): Promise<User | null> => {
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
        register,
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

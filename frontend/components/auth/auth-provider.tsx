"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordChangeRequest,
  UserUpdateRequest,
  ProfileUpdateRequest,
} from "@/types/auth"

// API Routes
const API_ROUTES = {
  LOGIN: "/api/auth/login/",
  LOGOUT: "/api/auth/logout/",
  USER: "/api/auth/user/",
  REGISTER: "/api/registration/",
  VERIFY_EMAIL: "/api/registration/verify-email/",
  RESEND_VERIFICATION: "/api/registration/resend-email/",
  PASSWORD_RESET: "/api/auth/password/reset/",
  PASSWORD_RESET_CONFIRM: "/api/auth/password/reset/confirm/",
  PASSWORD_CHANGE: "/api/auth/password/change/",
  PROFILE: "/api/profile/",
  SOCIAL_LOGIN: {
    GOOGLE: "/api/auth/social/google/",
  },
}

// Frontend Routes - define directly in the file
const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  VERIFICATION_SENT: "/auth/signup-success?verification=true",
  PASSWORD_RESET_SENT: "/auth/password-reset-sent",
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (data: PasswordResetRequest) => Promise<void>
  resetPasswordConfirm: (data: PasswordResetConfirm) => Promise<void>
  changePassword: (data: PasswordChangeRequest) => Promise<void>
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>
  updateUser: (data: UserUpdateRequest) => Promise<void>
  verifyEmail: (key: string) => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>
  socialLogin: (provider: string, token: string) => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Helper function to create full API URL
const createApiUrl = (path: string): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.detail || `Error: ${response.status} ${response.statusText}`
    throw new Error(errorMessage)
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return null
  }

  return await response.json()
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get user data from the server
        await refreshUserData()
      } catch (error) {
        // If server request fails, try to get from localStorage as fallback
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch (e) {
            console.error("Failed to parse stored user data")
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const refreshUserData = async (): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.USER), {
        credentials: "include",
      })
      const userData = await handleApiResponse(response)
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error("Error refreshing user data:", error)
      throw error
    }
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)

    try {
      const response = await fetch(createApiUrl(API_ROUTES.LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies in the request
      })

      const data = await handleApiResponse(response)

      // Store user data for UI purposes
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect based on user role
      if (data.user.is_staff) {
        router.push(ROUTES.ADMIN)
      } else {
        router.push(ROUTES.DASHBOARD)
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true)

    try {
      const response = await fetch(createApiUrl(API_ROUTES.REGISTER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Registration successful, redirect to verification page
      router.push(ROUTES.VERIFICATION_SENT)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)

    try {
      // Call logout endpoint
      await fetch(createApiUrl(API_ROUTES.LOGOUT), {
        method: "POST",
        credentials: "include",
      })

      // Clear local storage and state
      localStorage.removeItem("user")
      setUser(null)

      // Redirect to login page
      router.push(ROUTES.LOGIN)
    } catch (error) {
      console.error("Logout error:", error)

      // Even if the API call fails, clear local storage and state
      localStorage.removeItem("user")
      setUser(null)
      router.push(ROUTES.LOGIN)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (data: PasswordResetRequest): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.PASSWORD_RESET), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Password reset email sent successfully
      router.push(ROUTES.PASSWORD_RESET_SENT)
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  const resetPasswordConfirm = async (data: PasswordResetConfirm): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.PASSWORD_RESET_CONFIRM), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Password reset successful, redirect to login
      router.push(`${ROUTES.LOGIN}?reset=success`)
    } catch (error) {
      console.error("Password reset confirmation error:", error)
      throw error
    }
  }

  const changePassword = async (data: PasswordChangeRequest): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.PASSWORD_CHANGE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Password changed successfully
      return
    } catch (error) {
      console.error("Password change error:", error)
      throw error
    }
  }

  const updateProfile = async (data: ProfileUpdateRequest): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.PROFILE), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Refresh user data after profile update
      await refreshUserData()
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  const updateUser = async (data: UserUpdateRequest): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.USER), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      const updatedUser = await handleApiResponse(response)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("User update error:", error)
      throw error
    }
  }

  const verifyEmail = async (key: string): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.VERIFY_EMAIL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Email verified successfully, redirect to login
      router.push(`${ROUTES.LOGIN}?verified=true`)
    } catch (error) {
      console.error("Email verification error:", error)
      throw error
    }
  }

  const resendVerificationEmail = async (email: string): Promise<void> => {
    try {
      const response = await fetch(createApiUrl(API_ROUTES.RESEND_VERIFICATION), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      })

      await handleApiResponse(response)

      // Verification email resent successfully
      router.push(ROUTES.VERIFICATION_SENT)
    } catch (error) {
      console.error("Resend verification email error:", error)
      throw error
    }
  }

  const socialLogin = async (provider: string, token: string): Promise<void> => {
    setIsLoading(true)

    try {
      let endpoint = ""

      if (provider === "google") {
        endpoint = API_ROUTES.SOCIAL_LOGIN.GOOGLE
      } else {
        throw new Error(`Unsupported provider: ${provider}`)
      }

      const response = await fetch(createApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: token }),
        credentials: "include",
      })

      const data = await handleApiResponse(response)

      // Store user data for UI purposes
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect based on user role
      if (data.user.is_staff) {
        router.push(ROUTES.ADMIN)
      } else {
        router.push(ROUTES.DASHBOARD)
      }
    } catch (error) {
      console.error("Social login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.is_staff || false,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    resetPasswordConfirm,
    changePassword,
    updateProfile,
    updateUser,
    verifyEmail,
    resendVerificationEmail,
    socialLogin,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Authentication utility functions for making authenticated requests
 * and handling common auth operations using HTTP-only cookies
 */

import type { User } from "@/types/auth"

// API Routes
export const API_ROUTES = {
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

// Frontend Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  VERIFICATION_SENT: "/auth/verification-sent",
  PASSWORD_RESET_SENT: "/auth/password-reset-sent",
}

// Create full API URL
export const createApiUrl = (path: string): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}

// Handle API response
export const handleApiResponse = async (response: Response) => {
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

// Make authenticated fetch requests with credentials
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include", // Include cookies in the request
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(url, fetchOptions)

  return response
}

// User session storage in localStorage (only for UI purposes, auth is handled by cookies)
const USER_STORAGE_KEY = "accountancy_user"

// Store user data in localStorage (for UI purposes only)
export const storeUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }
}

// Get user data from localStorage
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem(USER_STORAGE_KEY)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }
  return null
}

// Clear auth data from localStorage
export const clearAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

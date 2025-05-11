"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const { login, isAuthenticated, user, loading: authLoading } = useAuth()
  // const [rememberMe, setRememberMe] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  // const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle redirection based on auth status
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace(user?.is_staff ? "/admin" : "/dashboard")
    }
  }, [isAuthenticated, authLoading, router, user])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." })
      return
    }
    setIsLoading(true)
    setMessage(null)

    try {
      console.log("Attempting login with:", { email, password })
      const userData = await login(email, password)

      // Get user data from the auth context instead of localStorage
      // const { user } = useAuth() // No longer needed
      console.log("Login succeeded, userData:", userData)

      setMessage({ type: "success", text: "You have been successfully logged in." })
      // setTimeout(() => {
      //     router.push(userData.is_staff ? "/admin" : "/dashboard")
      // }, 1000)
    } catch (error: any) {
      console.error("Login failed - Full error:", error)
      let errorMessage = "An unexpected error occurred."

      if (error.response?.data) {
        console.log("Error response data:", error.response.data)
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0]
        } else {
          errorMessage = JSON.stringify(error.response.data)
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
      {/* Custom Message Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-md text-white flex items-center justify-between ${message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-white hover:text-gray-200 focus:outline-none text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="pl-10 pr-12 py-2 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600"
            />
            <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </Label>
          </div>
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium">
            Apply Now
          </Link>
        </div>
      </form>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
  })
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update password validation if changing password1
    if (name === "password1") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Basic validation
    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    // Check password strength
    const isPasswordValid = Object.values(passwordValidation).every(Boolean)
    if (!isPasswordValid) {
      setError("Password does not meet all requirements")
      setIsSubmitting(false)
      return
    }

    try {
      await register(formData)
      // Redirect is handled in the auth provider
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Create an Account</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm font-medium dark:text-gray-300">
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm font-medium dark:text-gray-300">
              Last Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium dark:text-gray-300">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password1" className="text-sm font-medium dark:text-gray-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="password1"
              name="password1"
              type={showPassword1 ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password1}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword1(!showPassword1)}
              tabIndex={-1}
            >
              {showPassword1 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Password Requirements</h3>
          <ul className="space-y-1">
            <li className="flex items-center text-xs">
              <span
                className={
                  passwordValidation.length ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }
              >
                ✓ At least 8 characters long
              </span>
            </li>
            <li className="flex items-center text-xs">
              <span
                className={
                  passwordValidation.uppercase
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }
              >
                ✓ At least one uppercase letter
              </span>
            </li>
            <li className="flex items-center text-xs">
              <span
                className={
                  passwordValidation.lowercase
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }
              >
                ✓ At least one lowercase letter
              </span>
            </li>
            <li className="flex items-center text-xs">
              <span
                className={
                  passwordValidation.number ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }
              >
                ✓ At least one number
              </span>
            </li>
            <li className="flex items-center text-xs">
              <span
                className={
                  passwordValidation.special ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }
              >
                ✓ At least one special character
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password2" className="text-sm font-medium dark:text-gray-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="password2"
              name="password2"
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.password2}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword2(!showPassword2)}
              tabIndex={-1}
            >
              {showPassword2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.password1 !== formData.password2 && formData.password2 && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

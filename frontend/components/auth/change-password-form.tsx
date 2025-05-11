"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"

export function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: "",
  })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword1, setShowNewPassword1] = useState(false)
  const [showNewPassword2, setShowNewPassword2] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { changePassword } = useAuth()

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

    // Update password validation if changing new_password1
    if (name === "new_password1") {
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
    setSuccess(false)
    setIsSubmitting(true)

    // Basic validation
    if (formData.new_password1 !== formData.new_password2) {
      setError("New passwords do not match")
      setIsSubmitting(false)
      return
    }

    // Check password strength
    const isPasswordValid = Object.values(passwordValidation).every(Boolean)
    if (!isPasswordValid) {
      setError("New password does not meet all requirements")
      setIsSubmitting(false)
      return
    }

    try {
      await changePassword(formData)
      setSuccess(true)
      // Reset form
      setFormData({
        old_password: "",
        new_password1: "",
        new_password2: "",
      })
    } catch (err: any) {
      setError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Change Password</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
          <AlertDescription>Your password has been successfully changed.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="old_password" className="text-sm font-medium dark:text-gray-300">
            Current Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="old_password"
              name="old_password"
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter your current password"
              value={formData.old_password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowOldPassword(!showOldPassword)}
              tabIndex={-1}
            >
              {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new_password1" className="text-sm font-medium dark:text-gray-300">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="new_password1"
              name="new_password1"
              type={showNewPassword1 ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.new_password1}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowNewPassword1(!showNewPassword1)}
              tabIndex={-1}
            >
              {showNewPassword1 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Password Requirements</h3>
          <ul className="space-y-1">
            <li className="flex items-center text-xs">
              {passwordValidation.length ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span
                className={
                  passwordValidation.length ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }
              >
                At least 8 characters long
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordValidation.uppercase ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span
                className={
                  passwordValidation.uppercase
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }
              >
                At least one uppercase letter
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordValidation.lowercase ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span
                className={
                  passwordValidation.lowercase
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }
              >
                At least one lowercase letter
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordValidation.number ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span
                className={
                  passwordValidation.number ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }
              >
                At least one number
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordValidation.special ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span
                className={
                  passwordValidation.special ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }
              >
                At least one special character
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new_password2" className="text-sm font-medium dark:text-gray-300">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="new_password2"
              name="new_password2"
              type={showNewPassword2 ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.new_password2}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowNewPassword2(!showNewPassword2)}
              tabIndex={-1}
            >
              {showNewPassword2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.new_password1 !== formData.new_password2 && formData.new_password2 && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing password...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </div>
  )
}

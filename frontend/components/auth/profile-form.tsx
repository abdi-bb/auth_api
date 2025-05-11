"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, CheckCircle2 } from "lucide-react"
import type { ProfileUpdateRequest, UserUpdateRequest } from "@/types/auth"

export function ProfileForm() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, updateUser, updateProfile } = useAuth()

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setUserData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      // Update user data
      const userUpdateData: UserUpdateRequest = {
        first_name: userData.first_name,
        last_name: userData.last_name,
      }
      await updateUser(userUpdateData)

      // Update profile data
      const profileUpdateData: ProfileUpdateRequest = {
        bio: userData.bio,
      }
      await updateProfile(profileUpdateData)

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Profile Settings</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
          <AlertDescription>Your profile has been successfully updated.</AlertDescription>
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
                value={userData.first_name}
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
                value={userData.last_name}
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
              placeholder="Email address"
              value={userData.email}
              disabled={true} // Email cannot be changed
              className="pl-10 bg-gray-50 dark:bg-gray-700"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Email address cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium dark:text-gray-300">
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself"
            value={userData.bio}
            onChange={handleChange}
            disabled={isSubmitting}
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}

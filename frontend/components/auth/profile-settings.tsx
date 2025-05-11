"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export function ProfileSettings() {
  const { user, updateUser, updateProfile, changePassword } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: "",
  })

  const [userData, setUserData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  })

  const [profileData, setProfileData] = useState({
    bio: user?.profile?.bio || "",
  })

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(false)
    setIsUpdating(true)

    try {
      // Update user data
      await updateUser(userData)

      // Update profile data
      await updateProfile(profileData)

      setUpdateSuccess(true)
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(false)
    setIsUpdating(true)

    // Basic validation
    if (passwordData.new_password1 !== passwordData.new_password2) {
      setUpdateError("New passwords do not match")
      setIsUpdating(false)
      return
    }

    try {
      await changePassword(passwordData)
      setUpdateSuccess(true)
      setPasswordData({
        old_password: "",
        new_password1: "",
        new_password2: "",
      })
    } catch (err: any) {
      setUpdateError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) {
    return <div>Please log in to view your profile settings.</div>
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {updateError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{updateError}</AlertDescription>
        </Alert>
      )}

      {updateSuccess && (
        <Alert className="mb-4">
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleUserChange}
                  disabled={isUpdating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleUserChange}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-gray-100" />
              <p className="text-sm text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                disabled={isUpdating}
                rows={4}
              />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="password">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password</Label>
              <Input
                id="old_password"
                name="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password1">New Password</Label>
              <Input
                id="new_password1"
                name="new_password1"
                type="password"
                value={passwordData.new_password1}
                onChange={handlePasswordChange}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password2">Confirm New Password</Label>
              <Input
                id="new_password2"
                name="new_password2"
                type="password"
                value={passwordData.new_password2}
                onChange={handlePasswordChange}
                required
                disabled={isUpdating}
              />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

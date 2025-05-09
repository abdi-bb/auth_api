import type { Metadata } from "next"
import { ProfileForm } from "@/components/auth/profile-form"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Profile Settings | Authentication System",
  description: "Manage your profile settings",
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage your account information and password</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

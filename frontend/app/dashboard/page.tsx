import type { Metadata } from "next"
import { RouteGuard } from "@/components/auth/route-guard"
import { ProfileSettings } from "@/components/auth/profile-settings"

export const metadata: Metadata = {
  title: "Dashboard | Authentication System",
  description: "User dashboard",
}

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
            <p className="text-gray-600">This is a protected page that only authenticated users can access.</p>
          </div>

          <ProfileSettings />
        </div>
      </div>
    </RouteGuard>
  )
}

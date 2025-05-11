import type { Metadata } from "next"
import { RouteGuard } from "@/components/auth/route-guard"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
}

export default function AdminPage() {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to the admin dashboard</h2>
            <p className="text-gray-600">This is a protected page that only admin users can access.</p>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}

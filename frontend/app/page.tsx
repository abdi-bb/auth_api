import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Authentication System</h1>
        <p className="mt-3 text-lg text-gray-600">A reusable authentication system for Next.js applications</p>

        <div className="mt-8 space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/signin">Sign In</Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import { Footer } from "@/components/layout/footer"
// import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Reset Email Sent",
          description: "If an account exists with this email, you will receive a password reset link.",
        })
      } else {
        toast({
          title: "Error",
          description: data.detail || "An error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
              <Link href="/auth/signin" className="inline-flex items-center text-sm text-primary hover:text-primary-dark">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>

            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Reset your password</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {!isSubmitted ? (
              <div className="mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {isLoading && (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Check your email</h3>
                <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                  instructions to reset your password.
                </p>
                <p className="mt-4 text-sm text-green-700 dark:text-green-400">
                  If you don't see the email, check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:text-primary-dark underline"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

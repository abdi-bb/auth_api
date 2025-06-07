"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/auth/signup-form"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { SocialLogin } from "@/components/auth/social-login"

export default function SignupClient() {
    const { isAuthenticated, user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [showSignupForm, setShowSignupForm] = useState(false)

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated && user) {
                router.replace("/dashboard")
            } else {
                setShowSignupForm(true)
            }
        }
    }, [isAuthenticated, authLoading, router, user])

    if (!showSignupForm) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
                <div className="w-full max-w-md mx-auto">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Create a new account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Or{" "}
                            <Link href="/auth/signin" className="font-medium text-primary hover:text-primary-dark">
                                sign in to your account
                            </Link>
                        </p>
                    </div>
                    <div className="mt-8 space-y-6">
                        <SignupForm />
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    )
}

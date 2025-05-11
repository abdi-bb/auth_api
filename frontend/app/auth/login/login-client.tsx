"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"

export default function LoginClient() {
    const { isAuthenticated, user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [showLoginForm, setShowLoginForm] = useState(false)

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated && user) {
                router.replace(user.is_staff ? "/admin" : "/dashboard")
            }
            setShowLoginForm(true)
        }
    }, [isAuthenticated, authLoading, router, user])

    if (!showLoginForm) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
        )
    }

    return (
        <div>
            {/* <Navigation /> */}
            <div className="flex min-h-screen bg-gray-50">
                <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
                    <div className="w-full max-w-md mx-auto">
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Or{" "}
                                <Link href="/portal" className="font-medium text-primary hover:text-primary-dark">
                                    create a new account
                                </Link>
                            </p>
                        </div>
                        <div className="mt-8">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

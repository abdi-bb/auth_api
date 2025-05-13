"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface GoogleCallbackClientProps {
    code: string
}

export default function GoogleCallbackClient({ code }: GoogleCallbackClientProps) {
    const router = useRouter()
    const { socialLogin } = useAuth()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Simply pass the code to the backend
                await socialLogin("google", { code })

                // Redirect is handled in the auth provider
            } catch (err) {
                console.error("Google callback error:", err)
                setError(err instanceof Error ? err.message : "Authentication failed")

                // Redirect to signin page after a delay if there's an error
                setTimeout(() => {
                    router.push("/auth/signin")
                }, 3000)
            }
        }

        handleCallback()
    }, [code, socialLogin, router])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
                    <p className="text-gray-500 dark:text-gray-400">Redirecting to sign in page...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Completing authentication...</p>
        </div>
    )
}

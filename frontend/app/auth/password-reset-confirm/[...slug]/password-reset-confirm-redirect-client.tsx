"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PasswordResetConfirmRedirectClient({ params }: { params: { slug: string[] } }) {
    const router = useRouter()

    useEffect(() => {
        if (params.slug && params.slug.length >= 2) {
            const uid = params.slug[0]
            const token = params.slug[1]

            // Redirect to the properly formatted URL
            router.replace(`/auth/password-reset-confirm/${uid}/${token}`)
        } else {
            // Invalid URL format, redirect to forgot password page
            router.replace("/auth/forgot-password")
        }
    }, [params.slug, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <p className="text-lg">Redirecting...</p>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function VerifyAccount({ verificationKey }: { verificationKey: string }) {
    const [isVerifying, setIsVerifying] = useState(false)
    const router = useRouter()

    // Decode the URL-encoded key
    const decodedKey = decodeURIComponent(verificationKey)

    const handleVerify = async () => {
        setIsVerifying(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registration/verify-email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key: decodedKey }),
            })

            if (response.ok) {
                toast({
                    title: "Account Verified",
                    description: "Your account has been successfully verified. You can now log in.",
                })
                router.push("/auth/login")
            } else {
                const errorData = await response.json()
                toast({
                    title: "Verification Failed",
                    description: errorData.detail || "An error occurred during verification.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Verification error:", error)
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Verify Your Account</h1>
                <p className="text-center">Click the button below to verify your email address and activate your account.</p>
                <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
                    {isVerifying ? "Verifying..." : "Verify Email"}
                </Button>
            </div>
        </div>
    )
}

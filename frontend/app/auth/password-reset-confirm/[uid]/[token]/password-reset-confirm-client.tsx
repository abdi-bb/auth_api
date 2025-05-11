"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { Footer } from "@/components/layout/footer"
// import { Navbar } from "@/components/layout/navbar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function PasswordResetConfirmClient({ params }: { params: { uid: string; token: string } }) {
    const [passwords, setPasswords] = useState({
        new_password1: "",
        new_password2: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false,
    })
    const router = useRouter()
    const { uid, token } = params

    useEffect(() => {
        const password = passwords.new_password1
        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        })
    }, [passwords.new_password1])

    const validatePasswords = () => {
        const newErrors: Record<string, string> = {}

        // Check password requirements
        if (
            !passwordValidation.length ||
            !passwordValidation.uppercase ||
            !passwordValidation.number ||
            !passwordValidation.special
        ) {
            newErrors.new_password1 = "Password does not meet all requirements"
        }

        // Check if passwords match
        if (passwords.new_password1 !== passwords.new_password2) {
            newErrors.new_password2 = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePasswords()) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/reset/confirm/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    new_password1: passwords.new_password1,
                    new_password2: passwords.new_password2,
                    uid,
                    token,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setIsSuccess(true)
                toast({
                    title: "Password Reset Successful",
                    description: "Your password has been reset successfully.",
                })
            } else {
                // Handle specific error messages from the API
                if (data.new_password1) {
                    setErrors((prev) => ({ ...prev, new_password1: data.new_password1[0] }))
                }
                if (data.new_password2) {
                    setErrors((prev) => ({ ...prev, new_password2: data.new_password2[0] }))
                }
                if (data.token || data.uid) {
                    toast({
                        title: "Invalid or Expired Link",
                        description: "This password reset link is invalid or has expired. Please request a new one.",
                        variant: "destructive",
                    })
                } else if (data.detail) {
                    toast({
                        title: "Error",
                        description: data.detail,
                        variant: "destructive",
                    })
                } else {
                    toast({
                        title: "Error",
                        description: "An error occurred. Please try again.",
                        variant: "destructive",
                    })
                }
            }
        } catch (error) {
            console.error("Password reset confirm error:", error)
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
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                                {isSuccess ? "Password Reset Complete" : "Reset Your Password"}
                            </h2>
                            {!isSuccess && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please enter your new password below.</p>
                            )}
                        </div>

                        {!isSuccess ? (
                            <div className="mt-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="new_password1">New Password</Label>
                                        <Input
                                            id="new_password1"
                                            name="new_password1"
                                            type="password"
                                            required
                                            className="mt-1"
                                            value={passwords.new_password1}
                                            onChange={(e) => setPasswords({ ...passwords, new_password1: e.target.value })}
                                            disabled={isLoading}
                                        />
                                        {errors.new_password1 && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" /> {errors.new_password1}
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-2">Password Requirements</h3>
                                        <ul className="space-y-1">
                                            <li className="flex items-center text-xs">
                                                {passwordValidation.length ? (
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                                                )}
                                                <span
                                                    className={
                                                        passwordValidation.length
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }
                                                >
                                                    At least 8 characters long
                                                </span>
                                            </li>
                                            <li className="flex items-center text-xs">
                                                {passwordValidation.uppercase ? (
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                                                )}
                                                <span
                                                    className={
                                                        passwordValidation.uppercase
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }
                                                >
                                                    Include at least one uppercase letter
                                                </span>
                                            </li>
                                            <li className="flex items-center text-xs">
                                                {passwordValidation.number ? (
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                                                )}
                                                <span
                                                    className={
                                                        passwordValidation.number
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }
                                                >
                                                    Include at least one number
                                                </span>
                                            </li>
                                            <li className="flex items-center text-xs">
                                                {passwordValidation.special ? (
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                                                )}
                                                <span
                                                    className={
                                                        passwordValidation.special
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }
                                                >
                                                    Include at least one special character
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <Label htmlFor="new_password2">Confirm New Password</Label>
                                        <Input
                                            id="new_password2"
                                            name="new_password2"
                                            type="password"
                                            required
                                            className="mt-1"
                                            value={passwords.new_password2}
                                            onChange={(e) => setPasswords({ ...passwords, new_password2: e.target.value })}
                                            disabled={isLoading}
                                        />
                                        {errors.new_password2 && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" /> {errors.new_password2}
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                                Resetting Password...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex justify-center mb-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 text-center">
                                    Password Reset Successful
                                </h3>
                                <p className="mt-2 text-sm text-green-700 dark:text-green-400 text-center">
                                    Your password has been reset successfully. You can now log in with your new password.
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <Button asChild>
                                        <Link href="/auth/signin">Go to Sign In</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

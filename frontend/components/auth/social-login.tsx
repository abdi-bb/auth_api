"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Define the props for the social login buttons
interface SocialButtonProps {
  provider: string
  label: string
  icon: React.ReactNode
  disabled?: boolean
  onClick: () => void
}

// Social login button component
const SocialButton = ({ provider, label, icon, disabled = false, onClick }: SocialButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}

// Google icon component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export function SocialLogin() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { socialLogin } = useAuth()

  const handleGoogleLogin = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // In a real implementation, you would use a proper OAuth flow
      // This is a simplified example that would need to be replaced with actual OAuth

      // 1. Initialize Google OAuth client
      // const googleAuth = window.gapi.auth2.getAuthInstance()

      // 2. Sign in with Google
      // const googleUser = await googleAuth.signIn()

      // 3. Get the ID token
      // const token = googleUser.getAuthResponse().id_token

      // For demo purposes only - in a real app, you would get this token from Google OAuth
      const mockGoogleToken = "google-oauth-token"

      // 4. Send the token to your backend
      await socialLogin("google", mockGoogleToken)

      // Redirect is handled in the auth provider
    } catch (err: any) {
      setError(err.message || "Social login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SocialButton
        provider="google"
        label={isLoading ? "Signing in..." : "Sign in with Google"}
        icon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
        disabled={isLoading}
        onClick={handleGoogleLogin}
      />
    </div>
  )
}

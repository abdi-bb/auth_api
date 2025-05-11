import type { Metadata } from "next"
import LoginClient from "./login-client"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginPage() {
  return <LoginClient />
}

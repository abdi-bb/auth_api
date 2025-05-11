import type { Metadata } from "next"
import SigninClient from "./signin-client"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginPage() {
  return <SigninClient />
}

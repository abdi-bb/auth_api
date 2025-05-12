import type { Metadata } from "next"
import SignupSuccessClient from "./signup-success-client"

export const metadata: Metadata = {
  title: "Registration Successful",
  description: "Your account has been created successfully.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupSuccessPage() {
  return <SignupSuccessClient />
}

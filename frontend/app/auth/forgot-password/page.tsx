import ForgotPasswordClient from "./forgot-password-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset your password to regain access to your account",
    robots: {
        index: false,
        follow: false,
    },
}

export default function ForgotPasswordPage() {
    return (
        <div>
            <ForgotPasswordClient />
        </div>
    )
}

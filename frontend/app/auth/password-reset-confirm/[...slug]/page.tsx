import type { Metadata } from "next"
import PasswordResetConfirmRedirectClient from "./password-reset-confirm-redirect-client"

export const metadata: Metadata = {
    title: "Password Reset",
    description: "Reset your password to regain access to your account.",
    robots: {
        index: false,
        follow: false,
    },
}

export default function PasswordResetConfirmRedirectPage({ params }: { params: { slug: string[] } }) {
    return <PasswordResetConfirmRedirectClient params={params} />
}

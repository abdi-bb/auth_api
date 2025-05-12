import type { Metadata } from "next"
import PasswordResetConfirmClient from "./password-reset-confirm-client"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Create a new password for your account",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function PasswordResetConfirmPage({ params }: { params: { uid: string; token: string } }) {
    // In Next.js 15, params is a Promise that resolves to the actual parameters
    const parsedParams = await params;
    return <PasswordResetConfirmClient params={parsedParams} />
}

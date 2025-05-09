import type { Metadata } from "next"
import PasswordResetConfirmClient from "./password-reset-confirm-client"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Create a new password for your Savanna Accountancy account.",
    robots: {
        index: false,
        follow: false,
    },
}

export default function PasswordResetConfirmPage({ params }: { params: { uid: string; token: string } }) {
    return <PasswordResetConfirmClient params={params} />
}

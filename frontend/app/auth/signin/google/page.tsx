import { redirect } from "next/navigation"
import GoogleCallbackClient from "./google-callback-client"

export const dynamic = "force-dynamic"

export default function GoogleCallbackPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // If there's no code parameter, redirect to the signin page
    if (!searchParams.code) {
        redirect("/auth/signin")
    }

    return <GoogleCallbackClient code={searchParams.code as string} />
}

import { redirect } from "next/navigation"
import GoogleCallbackClient from "./google-callback-client"

export const dynamic = "force-dynamic"

export default async function GoogleCallbackPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // In Next.js 15, searchParams needs to be awaited
    const parseSearchParams = await searchParams
    const code = parseSearchParams.code

    // If there's no code parameter, redirect to the signin page
    if (!code) {
        redirect("/auth/signin")
    }

    return <GoogleCallbackClient code={code as string} />
}

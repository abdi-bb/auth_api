// import type { Metadata } from "next"
// import { VerifyEmailForm } from "@/components/auth/verify-email-form"

// export const metadata: Metadata = {
//   title: "Verify Email | Authentication System",
//   description: "Verify your email address",
// }

// interface VerifyEmailPageProps {
//   params: {
//     key: string
//   }
// }

// export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
//   const { key } = params

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Verify Email</h1>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Verifying your email address...</p>
//         </div>

//         <VerifyEmailForm verificationKey={key} />
//       </div>
//     </div>
//   )
// }

import type { Metadata } from "next"
import { VerifyAccount } from "@/components/auth/verify-account"

export const metadata: Metadata = {
  title: "Verify Account",
  description: "Verify your account",
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerifyAccountPage({ params }: { params: { key: string } }) {
  return <VerifyAccount verificationKey={params.key} />
}

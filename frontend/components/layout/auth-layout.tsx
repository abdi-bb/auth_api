import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/lib/auth"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Link href={ROUTES.HOME} className="flex items-center">
              <Image src="/abstract-logo.png" alt="Logo" width={40} height={40} className="mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Auth System</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="flex h-full items-center justify-center p-12">
            <div className="max-w-2xl text-white">
              <h2 className="text-4xl font-bold mb-6">Secure Authentication System</h2>
              <p className="text-xl mb-8">
                A complete authentication solution with user management, email verification, and more.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure JWT authentication
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email verification
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Password reset functionality
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Social authentication
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

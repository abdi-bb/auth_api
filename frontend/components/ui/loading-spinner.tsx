import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg"
  color?: string
  className?: string
}

export function LoadingSpinner({ size = "md", color = "border-blue-700", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className={cn("animate-spin rounded-full border-b-2", sizeClasses[size], color)} />
    </div>
  )
}

export function FullPageLoading() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function ButtonLoader({ className }: { className?: string }) {
  return <div className={cn("animate-spin h-5 w-5 border-b-2 rounded-full border-white", className)} />
}

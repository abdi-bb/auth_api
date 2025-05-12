export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Copyright */}
          <div className="border-t border-gray-200 pt-4 w-full">
            <p className="text-gray-600 text-sm text-center">
              &copy; {currentYear} Authentication System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

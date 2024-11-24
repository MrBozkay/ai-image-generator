import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand Section */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png" // Make sure to add your logo file in the public directory
              alt="AI Image Generator Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Image Generator</h1>
              <p className="text-sm text-gray-500">Create stunning AI-powered images</p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Gallery</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
} 
'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  try {
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <title>AI Image Generator</title>
          <meta name="description" 
            content="AI Image Generator" />
          
        </head>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <header className="bg-background shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-foreground">AI Image Generator</h1>
                  {isClient && <ThemeToggle />}
                </div>
              </header>
              <main className="flex-grow bg-background text-foreground">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <footer className="bg-background">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-muted-foreground text-sm">
                    © 2023 AI Image Generator. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  } catch (error) {
    console.error('Error in RootLayout:', error)
    return <div>Error loading layout</div> // Fallback UI
  }
}
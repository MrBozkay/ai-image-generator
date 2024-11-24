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
                  <div className="flex items-center space-x-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                      <path d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V14M20 10L15 7V17L20 14M20 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9 9L7 7M15 9L17 7M9 15L7 17M15 15L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <h1 className="text-2xl font-bold text-foreground">AI Image Generator</h1>
                  </div>
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
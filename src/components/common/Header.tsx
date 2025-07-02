"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { UserButton, useUser } from '@clerk/nextjs'
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Site Title */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-foreground hover:text-primary transition-colors">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          EverAfter Keepsake
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          <Link href="/timeline" className="text-foreground hover:text-primary transition-colors font-medium">
            Timeline
          </Link>
          <Link href="/albums" className="text-foreground hover:text-primary transition-colors font-medium">
            Photo Albums
          </Link>
          <Link href="/love-notes" className="text-foreground hover:text-primary transition-colors font-medium">
            Love Notes
          </Link>
          <Link href="/memory-map" className="text-foreground hover:text-primary transition-colors font-medium">
            Memory Map
          </Link>
          <Link href="/journal" className="text-foreground hover:text-primary transition-colors font-medium">
            Our Journal
          </Link>
          <Link href="/countdowns" className="text-foreground hover:text-primary transition-colors font-medium">
            Countdowns
          </Link>
        </nav>

        {/* User Authentication */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-muted-foreground font-body hidden sm:block">
                Welcome, {user.firstName}!
              </span>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonPopoverCard: 'bg-card border border-border',
                    userButtonPopoverActionButton: 'text-foreground hover:bg-muted'
                  }
                }}
              />
            </>
          ) : (
            <>
              <Link 
                href="/sign-in" 
                className="px-4 py-2 text-foreground hover:text-primary border border-border rounded-lg hover:bg-muted transition-all duration-200 font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-accent transition-all duration-200 font-medium shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

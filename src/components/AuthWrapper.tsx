'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AuthWrapperProps {
  children: ReactNode
  requireAuth?: boolean
}

export default function AuthWrapper({ 
  children,
  requireAuth = true 
}: AuthWrapperProps) {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // If auth is loaded and user is not signed in but we require auth
    if (isLoaded && !isSignedIn && requireAuth) {
      router.push('/sign-in')
    }
    
    // If auth is loaded and user is signed in, ensure they exist in our DB
    if (isLoaded && isSignedIn && userId) {
      const ensureUserInDb = async () => {
        try {
          setIsCreatingUser(true)
          const response = await fetch('/api/users')
          
          if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.error || 'Failed to verify user in database')
          }
          
          console.log('User verified in database')
        } catch (error) {
          console.error('Error ensuring user exists:', error)
          setError('Failed to initialize user data. Please refresh the page.')
          toast({
            title: 'Error',
            description: 'Failed to initialize user data. Please refresh the page.',
            variant: 'destructive',
          })
        } finally {
          setIsCreatingUser(false)
        }
      }
      
      ensureUserInDb()
    }
  }, [isLoaded, isSignedIn, userId, requireAuth, router, toast])

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading authentication...</p>
      </div>
    )
  }

  // Show loading while creating the user in our DB
  if (isCreatingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Initializing your account...</p>
      </div>
    )
  }

  // Show error if something went wrong
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="p-6 bg-destructive/10 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-destructive">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // If we don't require auth, or user is signed in, show the children
  return <>{children}</>
}

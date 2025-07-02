'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle, FileWarning } from 'lucide-react'

export default function MiddlewareDebugPage() {
  const [middlewareState, setMiddlewareState] = useState<'checking' | 'ok' | 'error' | null>(null)
  const [apiState, setApiState] = useState<'checking' | 'ok' | 'error' | null>(null)
  const [message, setMessage] = useState<string>('')
  const [details, setDetails] = useState<any>(null)
  const { isLoaded, isSignedIn, userId } = useAuth()

  const checkMiddleware = async () => {
    try {
      setMiddlewareState('checking')
      
      // Make a simple request to the API to test if middleware is working
      const response = await fetch('/api/test')
      const data = await response.json()
      
      setDetails(data)
      
      if (response.ok && data.auth?.authenticated) {
        setMiddlewareState('ok')
        setMessage('Middleware is working correctly! Authentication is being passed to API routes.')
      } else {
        setMiddlewareState('error')
        setMessage('Middleware may not be working correctly. Authentication is not being passed to API routes.')
      }
    } catch (error) {
      console.error('Error checking middleware:', error)
      setMiddlewareState('error')
      setMessage(`Error checking middleware: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  
  const checkApi = async () => {
    try {
      setApiState('checking')
      
      // Try albums API as it's one of the routes having issues
      const response = await fetch('/api/albums')
      const data = await response.json()
      
      if (response.ok) {
        setApiState('ok')
        setMessage(message + '\nAPI routes are working correctly!')
      } else {
        setApiState('error')
        setMessage(message + `\nAPI error: ${data.error || 'Unknown error'}`)
      }
      
      // Add API response to details
      setDetails(prev => ({
        ...prev,
        apiResponse: {
          status: response.status,
          ok: response.ok,
          data
        }
      }))
    } catch (error) {
      console.error('Error checking API:', error)
      setApiState('error')
      setMessage(message + `\nAPI error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  
  const fixAndRestart = () => {
    window.location.href = '/api/fix-middleware'
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Middleware & Authentication Debug</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Clerk Loaded</h3>
              {isLoaded ? 
                <CheckCircle2 className="h-6 w-6 text-green-500" /> : 
                <Loader2 className="h-6 w-6 animate-spin" />
              }
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Signed In</h3>
              {!isLoaded ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isSignedIn ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">User ID</h3>
              {!isLoaded ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : userId ? (
                <div className="truncate text-sm">{userId}</div>
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button onClick={checkMiddleware} disabled={middlewareState === 'checking'}>
              {middlewareState === 'checking' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : 'Check Middleware'}
            </Button>
            
            <Button 
              onClick={checkApi} 
              disabled={apiState === 'checking' || !isSignedIn}
              variant="outline"
            >
              {apiState === 'checking' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : 'Check API'}
            </Button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-md whitespace-pre-wrap ${
              middlewareState === 'error' || apiState === 'error' 
                ? 'bg-red-50 border border-red-200'
                : middlewareState === 'ok' 
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              {message}
            </div>
          )}
          
          {details && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Details:</h3>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fix Middleware</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-amber-500" />
              <p>If middleware is not working, your file might be in the wrong location.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-2">Middleware should be at <code className="bg-gray-200 px-1 py-0.5 rounded">./src/middleware.ts</code></p>
              <p>Currently there's a middleware file at <code className="bg-gray-200 px-1 py-0.5 rounded">./middleware.ts</code></p>
              <p>As well as a middleware file at <code className="bg-gray-200 px-1 py-0.5 rounded">./src/middleware.ts</code></p>
            </div>
            
            <p>Click the button below to use both middleware files and restart your server:</p>
            
            <div>
              <Button onClick={fixAndRestart}>
                Fix Middleware & Restart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

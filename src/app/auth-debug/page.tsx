'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthDebugPage() {
  const [authStatus, setAuthStatus] = useState<string>('Not checked')
  const [authData, setAuthData] = useState<any>(null)
  const [dbStatus, setDbStatus] = useState<string>('Not checked')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const checkAuth = async () => {
    try {
      setIsLoading(true)
      setAuthStatus('Checking...')
      
      // Make a request to an endpoint that requires authentication
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (response.ok) {
        setAuthStatus('Authenticated')
        setAuthData(data)
      } else {
        setAuthStatus(`Error: ${data.error || response.statusText}`)
      }
    } catch (error) {
      setAuthStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const checkDb = async () => {
    try {
      setIsLoading(true)
      setDbStatus('Checking...')
      
      // Make a request to our test endpoint
      const response = await fetch('/api/test')
      const data = await response.json()
      
      if (response.ok) {
        setDbStatus('Connected')
      } else {
        setDbStatus(`Error: ${data.error || response.statusText}`)
      }
    } catch (error) {
      setDbStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const createTestAlbum = async () => {
    try {
      setIsLoading(true)
      
      const testTitle = `Test Album ${new Date().toISOString()}`
      
      // Create a test album
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: testTitle,
          description: 'This is a test album created from the debug page',
          coverImage: 'https://placehold.co/600x400?text=Test+Album',
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(`Test album created successfully! ID: ${data.album._id}`)
      } else {
        alert(`Error creating test album: ${data.error || response.statusText}`)
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication & Database Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p><strong>Status:</strong> {authStatus}</p>
              {authData && (
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(authData, null, 2)}
                </pre>
              )}
            </div>
            <Button onClick={checkAuth} disabled={isLoading}>
              Check Authentication
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p><strong>Status:</strong> {dbStatus}</p>
            </div>
            <Button onClick={checkDb} disabled={isLoading}>
              Check Database Connection
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test Content Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={createTestAlbum} disabled={isLoading}>
              Create Test Album
            </Button>
            <p className="mt-4 text-gray-600">
              This will create a test album in the database. Check your console logs and database to verify creation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CloudinaryConfigCheck() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  
  const checkCloudinaryConfig = async () => {
    try {
      setStatus('checking')
      setMessage('Checking Cloudinary configuration...')
      
      // Display the environment variables (only public ones)
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      
      if (!cloudName) {
        throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
      }
      
      if (!uploadPreset) {
        throw new Error('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set')
      }
      
      // Verify if the cloud name is valid by fetching the Cloudinary info
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/ping`)
      
      if (!response.ok) {
        throw new Error(`Invalid cloud name: ${cloudName}. HTTP status: ${response.status}`)
      }
      
      setStatus('success')
      setMessage(`Cloudinary configuration is valid!
        
Cloud Name: ${cloudName}
Upload Preset: ${uploadPreset}

Note: We can't verify if the upload preset is valid without attempting an upload.`)
    } catch (error) {
      console.error('Error checking Cloudinary config:', error)
      setStatus('error')
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Cloudinary Configuration Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={checkCloudinaryConfig} 
            disabled={status === 'checking'}
            variant={status === 'error' ? 'destructive' : 'default'}
          >
            {status === 'checking' ? 'Checking...' : 'Check Cloudinary Config'}
          </Button>
          
          {message && (
            <div className={`p-4 rounded-md whitespace-pre-wrap
                ${status === 'success' ? 'bg-green-50 text-green-900 border border-green-200' :
                  status === 'error' ? 'bg-red-50 text-red-900 border border-red-200' :
                  status === 'checking' ? 'bg-blue-50 text-blue-900 border border-blue-200' : ''}`
                }>
              {message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

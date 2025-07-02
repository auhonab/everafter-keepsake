'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api } from '@/hooks/useApi'

export default function DatabaseTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await api.testConnection()
      setResult(response)
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Database Connection Test</h2>
      
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="w-full mb-4"
      >
        {loading ? 'Testing...' : 'Test Database Connection'}
      </Button>
      
      {result && (
        <div className={`p-3 rounded text-sm ${
          result.success 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <strong>Status:</strong> {result.success ? 'Success' : 'Failed'}<br />
          <strong>Message:</strong> {result.message}<br />
          {result.timestamp && (
            <>
              <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}<br />
            </>
          )}
          {result.error && (
            <>
              <strong>Error:</strong> {result.error}
            </>
          )}
        </div>
      )}
    </Card>
  )
}

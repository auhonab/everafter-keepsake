'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';

export default function TestConnectionPage() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDbConnection = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Test the connection by making a call to our debug API
      const response = await fetch('/api/debug-db');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error testing connection:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testUserCreation = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Test user creation by calling our user creation test API
      const response = await fetch('/api/test-user-creation');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error testing user creation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <div>You must be signed in to use this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MongoDB Connection Test</h1>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p><strong>Authentication Status:</strong> {isSignedIn ? 'Signed In' : 'Not Signed In'}</p>
        <p><strong>User ID:</strong> {userId || 'No user ID'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Test Database Connection</h2>
          <p className="mb-4">
            Tests the connection to MongoDB using the URI from your .env file.
          </p>
          
          <Button 
            onClick={testDbConnection} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </Button>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Test User Creation</h2>
          <p className="mb-4">
            Tests if the user creation process works correctly using ensureUserExists.
          </p>
          
          <Button 
            onClick={testUserCreation} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Testing...' : 'Test User Creation'}
          </Button>
        </Card>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Test Results</h3>
          
          <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

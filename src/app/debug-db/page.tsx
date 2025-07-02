'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DebugDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDatabaseTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug-db');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error testing database:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Debug Page</h1>
      
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Database Connection Test</h2>
        <p className="mb-4">
          This page helps diagnose database connection issues by testing MongoDB connectivity,
          querying existing users, and performing a test write operation.
        </p>
        
        <Button 
          onClick={runDatabaseTest} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </Button>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {results && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Test Results</h3>
            
            <div className="bg-gray-100 p-4 rounded mb-4">
              <div className="mb-2">
                <strong>Status:</strong> {results.success ? 'SUCCESS' : 'FAILED'}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {results.message}
              </div>
              <div className="mb-2">
                <strong>MongoDB Connection:</strong> {results.mongodbStatus?.status || 'Unknown'} 
                (ReadyState: {results.mongodbStatus?.readyState})
              </div>
              <div className="mb-2">
                <strong>User Count:</strong> {results.userCount !== undefined ? results.userCount : 'Unknown'}
              </div>
              <div className="mb-2">
                <strong>Test Write Operation:</strong> {results.testWriteSuccessful ? 'Successful' : 'Failed'}
              </div>
            </div>
            
            {results.users && results.users.length > 0 ? (
              <div>
                <h4 className="text-md font-semibold mb-2">Users in Database:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">ClerkID</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.users.map((user: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="py-2 px-4 border-b">{user.clerkId}</td>
                          <td className="py-2 px-4 border-b">{user.email}</td>
                          <td className="py-2 px-4 border-b">
                            {user.firstName} {user.lastName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                No users found in database
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Raw Response:</h4>
              <pre className="bg-gray-800 text-gray-200 p-4 rounded overflow-x-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

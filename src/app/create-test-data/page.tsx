'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function CreateTestDataPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createTestData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/create-test-data', {
        method: 'POST'
      });
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error creating test data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Test Data</h1>
      
      <div className="mb-4">
        <Link href="/debug-db" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Database Debug
        </Link>
      </div>
      
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Create Sample Data for Testing</h2>
        <p className="mb-4">
          This will create sample data for all content types (memories, albums, journal entries, etc.)
          to test if database writes are working properly. The data will be associated with your user account.
        </p>
        
        <Button 
          onClick={createTestData} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Creating...' : 'Create Test Data'}
        </Button>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {results && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            
            <div className="bg-gray-100 p-4 rounded mb-4">
              <div className="mb-2">
                <strong>Status:</strong> {results.success ? 'SUCCESS' : 'FAILED'}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {results.message}
              </div>
            </div>
            
            {results.data && (
              <div>
                <h4 className="text-md font-semibold mb-2">Created Data:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Item Type</th>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">User</td>
                        <td className="py-2 px-4 border-b">{results.data.user?.id}</td>
                        <td className="py-2 px-4 border-b">
                          Clerk ID: {results.data.user?.clerkId}<br />
                          Email: {results.data.user?.email}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 border-b">Memory</td>
                        <td className="py-2 px-4 border-b">{results.data.memory?.id}</td>
                        <td className="py-2 px-4 border-b">{results.data.memory?.title}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Album</td>
                        <td className="py-2 px-4 border-b">{results.data.album?.id}</td>
                        <td className="py-2 px-4 border-b">{results.data.album?.title}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 border-b">Journal Entry</td>
                        <td className="py-2 px-4 border-b">{results.data.journalEntry?.id}</td>
                        <td className="py-2 px-4 border-b">{results.data.journalEntry?.title}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Love Note</td>
                        <td className="py-2 px-4 border-b">{results.data.loveNote?.id}</td>
                        <td className="py-2 px-4 border-b">{results.data.loveNote?.content}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 border-b">Milestone</td>
                        <td className="py-2 px-4 border-b">{results.data.milestone?.id}</td>
                        <td className="py-2 px-4 border-b">{results.data.milestone?.title}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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

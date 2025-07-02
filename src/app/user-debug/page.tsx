'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function UserDebugPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const router = useRouter();
  const { userId, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    async function fetchDebugData() {
      try {
        setLoading(true);
        const response = await fetch('/api/test-user-creation');
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        setDebugData(data);
      } catch (err) {
        console.error('Debug fetch error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    
    if (isLoaded) {
      if (isSignedIn) {
        fetchDebugData();
      } else {
        router.push('/sign-in');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User and Database Debug</h1>
      
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
        <h2 className="font-semibold">Clerk Authentication Status:</h2>
        <p>Clerk loaded: {isLoaded ? '✅' : '❌'}</p>
        <p>User signed in: {isSignedIn ? '✅' : '❌'}</p>
        <p>Clerk User ID: {userId || 'None'}</p>
      </div>
      
      {loading && <p className="text-gray-500">Loading debug data...</p>}
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-300 rounded">
          <h2 className="font-semibold text-red-700">Error:</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {debugData && (
        <div className="mt-6">
          <h2 className="font-semibold text-xl mb-2">Debug Results:</h2>
          
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold">Initial User Lookup:</h3>
            <p>Found: {debugData.directLookup.found ? '✅' : '❌'}</p>
            {debugData.directLookup.data && (
              <pre className="bg-gray-100 p-2 text-xs mt-2 overflow-x-auto">
                {JSON.stringify(debugData.directLookup.data, null, 2)}
              </pre>
            )}
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold">ensureUserExists Results:</h3>
            <p>Success: {debugData.ensureUserExists.success ? '✅' : '❌'}</p>
            {debugData.ensureUserExists.data && (
              <pre className="bg-gray-100 p-2 text-xs mt-2 overflow-x-auto">
                {JSON.stringify(debugData.ensureUserExists.data, null, 2)}
              </pre>
            )}
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold">Verification Lookup:</h3>
            <p>Found: {debugData.verification.found ? '✅' : '❌'}</p>
            {debugData.verification.data && (
              <pre className="bg-gray-100 p-2 text-xs mt-2 overflow-x-auto">
                {JSON.stringify(debugData.verification.data, null, 2)}
              </pre>
            )}
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold">MongoDB Models:</h3>
            <ul className="list-disc pl-5">
              {debugData.mongodbModels.map((model: string) => (
                <li key={model}>{model}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold">Collection Stats:</h3>
            <pre className="bg-gray-100 p-2 text-xs mt-2 overflow-x-auto">
              {JSON.stringify(debugData.collectionStats, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Debug Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

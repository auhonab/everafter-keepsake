'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function EnvironmentDebugPage() {
  const [envData, setEnvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchEnvData() {
      try {
        const response = await fetch('/api/env-debug');
        const data = await response.json();
        setEnvData(data);
      } catch (err) {
        console.error('Error fetching environment data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchEnvData();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      
      <div className="mb-4">
        <Link href="/debug" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Debug Dashboard
        </Link>
      </div>
      
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
        
        {loading ? (
          <div className="p-4 text-center">Loading environment data...</div>
        ) : error ? (
          <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">MongoDB</h3>
              <div className="bg-gray-100 p-3 rounded">
                <div className="mb-1">
                  <strong>URI Configured:</strong> {envData?.mongodb?.uriConfigured ? 'Yes' : 'No'}
                </div>
                <div className="mb-1">
                  <strong>URI Format Valid:</strong> {envData?.mongodb?.uriValid ? 'Yes' : 'No'}
                  {!envData?.mongodb?.uriValid && envData?.mongodb?.uriError && (
                    <div className="text-red-600 text-sm mt-1">{envData.mongodb.uriError}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Clerk Authentication</h3>
              <div className="bg-gray-100 p-3 rounded">
                <div className="mb-1">
                  <strong>Publishable Key:</strong> {envData?.clerk?.publishableKeyConfigured ? 'Configured' : 'Missing'}
                </div>
                <div className="mb-1">
                  <strong>Secret Key:</strong> {envData?.clerk?.secretKeyConfigured ? 'Configured' : 'Missing'}
                </div>
                <div className="mb-1">
                  <strong>Webhook Secret:</strong> {envData?.clerk?.webhookSecretConfigured ? 'Configured' : 'Missing'}
                  {envData?.clerk?.webhookSecretDefault && (
                    <div className="text-yellow-600 text-sm mt-1">Warning: Using default webhook secret placeholder</div>
                  )}
                </div>
                <div className="mb-1">
                  <strong>Sign In URL:</strong> {envData?.clerk?.signInUrlConfigured ? envData.clerk.signInUrl : 'Missing'}
                </div>
                <div className="mb-1">
                  <strong>Sign Up URL:</strong> {envData?.clerk?.signUpUrlConfigured ? envData.clerk.signUpUrl : 'Missing'}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Cloudinary</h3>
              <div className="bg-gray-100 p-3 rounded">
                <div className="mb-1">
                  <strong>Cloud Name:</strong> {envData?.cloudinary?.cloudNameConfigured ? envData.cloudinary.cloudName : 'Missing'}
                </div>
                <div className="mb-1">
                  <strong>Upload Preset:</strong> {envData?.cloudinary?.uploadPresetConfigured ? envData.cloudinary.uploadPreset : 'Missing'}
                </div>
                <div className="mb-1">
                  <strong>Cloudinary URL:</strong> {envData?.cloudinary?.cloudinaryUrlConfigured ? 'Configured' : 'Missing'}
                  {envData?.cloudinary?.cloudinaryUrlValid === false && (
                    <div className="text-red-600 text-sm mt-1">Invalid Cloudinary URL format</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Next.js Configuration</h3>
              <div className="bg-gray-100 p-3 rounded">
                <div className="mb-1">
                  <strong>NODE_ENV:</strong> {envData?.nextjs?.nodeEnv || 'Not detected'}
                </div>
                <div className="mb-1">
                  <strong>Vercel Environment:</strong> {envData?.nextjs?.vercelEnv || 'Not detected'}
                </div>
                <div className="mb-1">
                  <strong>Images Domains:</strong> {envData?.nextjs?.imageDomainsConfigured ? 'Configured' : 'Not verified'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

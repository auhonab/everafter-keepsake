"use client"

import { useState } from "react"
import Header from "@/components/common/Header"
import ConnectionTest from "@/components/ConnectionTest"
import CloudinaryConfigCheck from "@/components/CloudinaryConfigCheck"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUpload from "@/components/ui/image-upload"

export default function DebugPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Debug & Diagnostics
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Test and troubleshoot your application
          </p>
        </div>
        
        <Tabs defaultValue="database" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="database">Database Connection</TabsTrigger>
            <TabsTrigger value="image-upload">Image Upload</TabsTrigger>
            <TabsTrigger value="api-tests">API Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="space-y-6">
            <ConnectionTest />
          </TabsContent>
          
          <TabsContent value="image-upload" className="space-y-6">
            <CloudinaryConfigCheck />
          
            <Card>
              <CardHeader>
                <CardTitle>Test Image Upload</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-full max-w-md">
                  <ImageUpload
                    onImageUploaded={(url: string) => setUploadedImage(url)}
                    caption="Upload Test Image"
                    height={300}
                    width={400}
                  />
                </div>
                
                {uploadedImage && (
                  <div className="w-full max-w-md">
                    <h3 className="text-sm font-medium mb-2">Uploaded Image URL:</h3>
                    <div className="p-2 bg-muted rounded-md overflow-auto text-xs break-all">
                      {uploadedImage}
                    </div>
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded test" 
                      className="mt-4 max-w-full h-auto rounded-md border" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ApiTestButton endpoint="/api/test" label="Test Connection" />
                  <ApiTestButton endpoint="/api/users" label="Test Users API" />
                  <ApiTestButton endpoint="/api/journal" label="Test Journal API" />
                  <ApiTestButton endpoint="/api/love-notes" label="Test Love Notes API" />
                  <ApiTestButton endpoint="/api/albums" label="Test Albums API" />
                  <ApiTestButton endpoint="/api/memories" label="Test Memories API" />
                  <ApiTestButton endpoint="/api/milestones" label="Test Milestones API" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ApiTestButton({ endpoint, label }: { endpoint: string, label: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [response, setResponse] = useState<any>(null)
  
  const testApi = async () => {
    try {
      setStatus("loading")
      const res = await fetch(endpoint)
      const data = await res.json()
      setResponse(data)
      setStatus(res.ok ? "success" : "error")
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : "Unknown error" })
      setStatus("error")
    }
  }
  
  return (
    <div className="space-y-2">
      <Button 
        onClick={testApi} 
        disabled={status === "loading"}
        variant={status === "success" ? "default" : status === "error" ? "destructive" : "outline"}
        className="w-full"
      >
        {label}
      </Button>
      {response && (
        <div className="p-2 bg-muted rounded-md overflow-auto text-xs max-h-40">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

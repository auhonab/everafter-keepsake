"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Loader2 } from "lucide-react"

export default function ConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    try {
      setStatus("loading")
      setMessage("Testing connection...")

      const response = await fetch("/api/test")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage("Connection successful!")
      } else {
        setStatus("error")
        setMessage("Connection failed")
      }

      setDetails(data)
    } catch (error) {
      setStatus("error")
      setMessage("Connection error")
      setDetails({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Connection Test
          {status === "success" && <Check className="text-green-500" />}
          {status === "error" && <X className="text-red-500" />}
          {status === "loading" && <Loader2 className="animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          {message && <p className="mb-2">{message}</p>}
          {details && (
            <pre className="p-2 bg-muted rounded-md overflow-auto text-xs">
              {JSON.stringify(details, null, 2)}
            </pre>
          )}
        </div>
        <Button onClick={testConnection} disabled={status === "loading"}>
          {status === "loading" ? "Testing..." : "Test Connection"}
        </Button>
      </CardContent>
    </Card>
  )
}

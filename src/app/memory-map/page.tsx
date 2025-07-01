import Header from "@/components/common/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Map } from "lucide-react"

export default function MemoryMap() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Map of Memories
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Charting our journey, one pin at a time.
          </p>
        </div>

        {/* Placeholder Card */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-headline text-foreground">
              <Wrench className="h-8 w-8 text-primary" />
              Coming Soon!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground font-body">
              We're working hard to bring you an interactive map where you can explore all the special places in your love story. Each location will tell its own tale, marked with photos, memories, and the moments that made them meaningful.
            </p>
            
            {/* Large decorative map icon */}
            <div className="flex justify-center py-8">
              <Map className="h-32 w-32 text-muted-foreground/30" />
            </div>
            
            <p className="text-sm text-muted-foreground/80 font-body italic">
              This feature is currently under construction. Thank you for your patience!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

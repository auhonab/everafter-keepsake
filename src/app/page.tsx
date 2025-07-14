'use client'

import { 
  HeartHandshake, 
  History, 
  Image as ImageIcon, 
  NotebookText, 
  Map, 
  BookHeart, 
  CalendarClock, 
  Sparkles 
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  
  const handleStartClick = () => {
    if (isLoaded && isSignedIn) {
      router.push('/home')
    } else {
      router.push('/sign-in')
    }
  }
  return (
    <ScrollArea className="h-screen">
      <div className="relative bg-background dark:bg-background min-h-screen welcome-page-texture">
        {/* Watercolor Texture Overlay */}
        <div className="absolute top-0 left-0 w-full h-full watercolor-overlay z-0 pointer-events-none"></div>
        
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-primary/20 to-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-bl from-primary/10 to-primary/5 rounded-full blur-2xl"></div>
          <div 
            className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-primary/10 to-primary/5"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
          
          {/* Line Art Doodles */}
          <svg className="doodle line-art-heart absolute top-32 left-16">
            <path d="M15,6 C15,6 7,0 3,6 C-1,12 5,18 15,24 C25,18 31,12 27,6 C23,0 15,6 15,6 Z"></path>
          </svg>
          
          <svg className="doodle line-art-star absolute top-40 right-24">
            <path d="M12,2 L15,9 L22,9 L16,14 L19,21 L12,17 L5,21 L8,14 L2,9 L9,9 Z"></path>
          </svg>
          
          <svg className="doodle line-art-flower absolute bottom-48 left-24">
            <path d="M18,18 C25,18 25,11 18,11 C18,4 11,4 11,11 C4,11 4,18 11,18 C11,25 18,25 18,18 Z"></path>
            <circle cx="14.5" cy="14.5" r="3"></circle>
          </svg>
          
          <svg className="doodle line-art-envelope absolute bottom-32 right-16">
            <path d="M3,8 L16,8 L16,16 L3,16 Z"></path>
            <path d="M3,8 L9.5,12 L16,8"></path>
          </svg>
          
          <svg className="doodle line-art-heart absolute top-96 right-48">
            <path d="M15,6 C15,6 7,0 3,6 C-1,12 5,18 15,24 C25,18 31,12 27,6 C23,0 15,6 15,6 Z"></path>
          </svg>
          
          <svg className="doodle line-art-star absolute top-72 left-48">
            <path d="M12,2 L15,9 L22,9 L16,14 L19,21 L12,17 L5,21 L8,14 L2,9 L9,9 Z"></path>
          </svg>
        </div>
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <HeartHandshake className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
              Everafter Keepsake
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12">
              Because Friendship is Forever.
            </p>
            <button 
              onClick={handleStartClick}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Keepsake
            </button>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 px-4 relative z-10">
          {/* Doodles around About section */}
          <div className="absolute left-8 top-8 pointer-events-none">
            <svg className="doodle line-art-flower" style={{ opacity: "0.08" }}>
              <path d="M18,18 C25,18 25,11 18,11 C18,4 11,4 11,11 C4,11 4,18 11,18 C11,25 18,25 18,18 Z"></path>
              <circle cx="14.5" cy="14.5" r="3"></circle>
            </svg>
          </div>
          
          <div className="absolute right-8 bottom-8 pointer-events-none">
            <svg className="doodle line-art-heart" style={{ opacity: "0.08" }}>
              <path d="M15,6 C15,6 7,0 3,6 C-1,12 5,18 15,24 C25,18 31,12 27,6 C23,0 15,6 15,6 Z"></path>
            </svg>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
              About Everafter Keepsake
            </h2>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              Preserving memories and celebrating friendship digitally. We provide a space for your photos, notes, locations, journals, and more, all beautifully woven together to tell your unique story.
            </p>
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 text-center">
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <History className="h-8 w-8 text-primary" />
                    <span className="font-medium">Timeline</span>
                  </div>
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <ImageIcon className="h-8 w-8 text-primary" />
                    <span className="font-medium">Photo Albums</span>
                  </div>
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <NotebookText className="h-8 w-8 text-primary" />
                    <span className="font-medium">Notes & Letters</span>
                  </div>
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <Map className="h-8 w-8 text-primary" />
                    <span className="font-medium">Map of Memories</span>
                  </div>
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <BookHeart className="h-8 w-8 text-primary" />
                    <span className="font-medium">Friendship Journal</span>
                  </div>
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <CalendarClock className="h-8 w-8 text-primary" />
                    <span className="font-medium">Anniversary Countdown</span>
                  </div>
                  <div className="flex flex-col items-center p-4 space-y-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <span className="font-medium">AI Poem Generator</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Footer Section */}
        <footer className="py-16 px-4 text-center relative z-10">
          {/* Doodles around footer */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="doodle line-art-envelope" style={{ opacity: "0.07" }}>
              <path d="M3,8 L16,8 L16,16 L3,16 Z"></path>
              <path d="M3,8 L9.5,12 L16,8"></path>
            </svg>
          </div>
          
          <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="doodle line-art-star" style={{ opacity: "0.07" }}>
              <path d="M12,2 L15,9 L22,9 L16,14 L19,21 L12,17 L5,21 L8,14 L2,9 L9,9 Z"></path>
            </svg>
          </div>
          
          <p className="text-muted-foreground mb-2">Built with love for every kind of forever.</p>
          <p className="text-sm text-muted-foreground/70">© 2025 Everafter Keepsake. All rights reserved.</p>
        </footer>
      </div>
    </ScrollArea>
  )
}

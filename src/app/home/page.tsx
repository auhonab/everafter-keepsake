import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  Calendar, 
  Camera, 
  BookOpen, 
  MessageCircle, 
  MapPin, 
  Gift 
} from "lucide-react"
import Header from "@/components/common/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ImageGallery from "@/components/ui/image-gallery"
import PoemGenerator from "@/components/PoemGenerator"

export default function Home() {
  const heroImages = [
    {
      src: "https://placehold.co/600x400.png",
      alt: "Couple smiling together",
      dataHint: "couple smiling"
    },
    {
      src: "https://placehold.co/600x400.png",
      alt: "Romantic dinner date",
      dataHint: "romantic dinner"
    },
    {
      src: "https://placehold.co/600x400.png",
      alt: "Walking together in nature", 
      dataHint: "couple walking in nature"
    }
  ]

  const features = [
    {
      icon: Calendar,
      title: "Timeline",
      description: "Chronicle your journey together with meaningful milestones and memories",
      href: "/timeline"
    },
    {
      icon: Camera,
      title: "Photo Albums",
      description: "Organize and cherish your favorite moments in beautiful digital albums",
      href: "/albums"
    },
    {
      icon: MessageCircle,
      title: "Love Notes",
      description: "Exchange and save heartfelt messages and letters for each other",
      href: "/love-notes"
    },
    {
      icon: MapPin,
      title: "Memory Map",
      description: "Mark the locations that hold special meaning in your relationship",
      href: "/memory-map"
    },
    {
      icon: BookOpen,
      title: "Our Journal",
      description: "Write and preserve your thoughts, feelings, and shared experiences",
      href: "/journal"
    },
    {
      icon: Gift,
      title: "Countdowns",
      description: "Keep track of anniversaries, special dates, and upcoming celebrations",
      href: "/countdowns"
    }
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Header />
      
      <main className="space-y-0">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Welcome Text */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-headline font-bold text-foreground leading-tight tracking-tight">
                  Our Story, Our Sanctuary
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md font-body">
                  A digital keepsake where love stories live forever. Capture, preserve, and celebrate 
                  the beautiful moments that make your relationship unique.
                </p>
              </div>
              
              {/* Right Column - Image Gallery */}
              <div className="relative">
                <ImageGallery images={heroImages} />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
                Explore Our Keepsakes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                Discover all the ways you can capture, organize, and celebrate your love story
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Link key={index} href={feature.href}>
                    <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                      <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold font-body">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI Poem Generator Section */}
        <section id="poem-generator" className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                Surprise Feature
              </Badge>
              <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
                AI Love Poem Generator
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                Let artificial intelligence help you express your feelings with personalized love poems 
                created just for your unique story.
              </p>
            </div>
            
            <div className="flex justify-center">
              <PoemGenerator />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

import Link from "next/link"
import { 
  History, 
  Images, 
  BookHeart, 
  PenSquare, 
  MapPin, 
  CalendarClock 
} from "lucide-react"
import Header from "@/components/common/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import WritingPromptGenerator from "@/components/ui/writing-prompt-generator"
import PoemGenerator from "@/components/PoemGenerator"

export default function Home() {
  const features = [
    {
      icon: History,
      title: "Timeline",
      description: "Chronicle your journey together, from the day you met to your latest adventure",
      href: "/timeline"
    },
    {
      icon: Images,
      title: "Photo Albums",
      description: "Create shared albums for every occasion, beautifully displayed and easy to browse",
      href: "/albums"
    },
    {
      icon: PenSquare,
      title: "Love Notes",
      description: "Write and save digital letters, capturing your thoughts and feelings for each other",
      href: "/love-notes"
    },
    {
      icon: MapPin,
      title: "Memory Map",
      description: "Pin your favorite moments to a world map, creating a visual story of your travels",
      href: "/memory-map"
    },
    {
      icon: BookHeart,
      title: "Our Journal",
      description: "A shared diary for your friendship, with options for both private and public entries",
      href: "/journal"
    },
    {
      icon: CalendarClock,
      title: "Countdowns",
      description: "Never miss a special date with a countdown to your friendship anniversaries and milestones",
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
              
              {/* Right Column - Writing Prompt Generator */}
              <div className="relative flex justify-center">
                <WritingPromptGenerator />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30 dark:bg-muted/10">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold text-foreground dark:text-foreground mb-4">
                Explore Our Keepsakes
              </h2>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground/90 max-w-2xl mx-auto font-body">
                Discover all the ways you can capture, organize, and celebrate your love story
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Link key={index} href={feature.href}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group bg-card dark:bg-card/80 border-border/60 dark:border-border/40 shadow-sm">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-md bg-primary dark:bg-primary/80 flex items-center justify-center group-hover:bg-primary/90 dark:group-hover:bg-primary/70 transition-colors shadow-inner">
                          <IconComponent className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-xl font-headline text-foreground dark:text-foreground">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground dark:text-muted-foreground/90">
                          {feature.description}
                        </p>
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
                Poem Generator
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

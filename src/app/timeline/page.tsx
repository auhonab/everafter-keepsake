import Header from "@/components/common/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Heart, 
  Plane, 
  Star, 
  Calendar,
  MapPin,
  Camera,
  Gift,
  Home
} from "lucide-react"

export default function Timeline() {
  const timelineEvents = [
    {
      icon: Heart,
      date: "March 15, 2020",
      title: "The Beginning",
      description: "Our eyes met across the crowded coffee shop, and in that moment, everything changed. What started as a chance encounter became the foundation of our beautiful love story."
    },
    {
      icon: Plane,
      date: "August 22, 2020", 
      title: "First Vacation",
      description: "Our first trip together to the mountains. We discovered our shared love for adventure, watched the sunrise from the peak, and knew we wanted to explore the world together."
    },
    {
      icon: Star,
      date: "March 15, 2021",
      title: "One Year Anniversary",
      description: "Celebrating our first year together with a romantic dinner under the stars. We exchanged promises and realized that this was just the beginning of our journey."
    },
    {
      icon: Home,
      date: "June 10, 2022",
      title: "Moving In Together",
      description: "The day we officially made our home together. Boxes everywhere, but our hearts were full knowing we were starting this new chapter as a team."
    },
    {
      icon: Gift,
      date: "December 24, 2022",
      title: "First Christmas",
      description: "Our first Christmas in our own home. Creating new traditions, exchanging meaningful gifts, and realizing how perfectly our lives fit together."
    },
    {
      icon: Camera,
      date: "Present Day",
      title: "Our Story Continues",
      description: "Every day brings new memories, deeper love, and endless possibilities. This timeline captures our past, but our future is still being written together."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Our Timeline
          </h1>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            A look back at the moments that made us.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pb-12">
          {/* Central Vertical Line - Desktop */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-accent transform -translate-x-1/2 hidden md:block"></div>
          
          {/* Mobile Timeline Line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-accent md:hidden"></div>
          
          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className="relative">
                  {/* Event Card */}
                  <div className={`flex ${isEven ? 'justify-start' : 'justify-end'} md:flex ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-start`}>
                    <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8' : 'md:pl-8'} pl-16 md:pl-0`}>
                      <Card className="hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <CardHeader className={`${isEven ? 'md:text-left' : 'md:text-right'} text-left`}>
                          <p className="text-sm text-muted-foreground font-body mb-2">
                            {event.date}
                          </p>
                          <CardTitle className="text-2xl font-headline text-foreground">
                            {event.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={`${isEven ? 'md:text-left' : 'md:text-right'} text-left`}>
                          <p className="text-muted-foreground font-body leading-relaxed">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Central Icon - Desktop */}
                  <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
                    <div className="w-12 h-12 rounded-full bg-accent border-4 border-background flex items-center justify-center shadow-lg">
                      <IconComponent className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                  
                  {/* Side Icon - Mobile */}
                  <div className="absolute left-8 top-8 transform -translate-x-1/2 -translate-y-1/2 md:hidden z-10">
                    <div className="w-12 h-12 rounded-full bg-accent border-4 border-background flex items-center justify-center shadow-lg">
                      <IconComponent className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* End cap for the timeline */}
          <div className="absolute left-1/2 bottom-0 w-4 h-4 bg-accent rounded-full transform -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-8 bottom-0 w-4 h-4 bg-accent rounded-full transform -translate-x-1/2 md:hidden"></div>
        </div>
      </main>
    </div>
  )
}

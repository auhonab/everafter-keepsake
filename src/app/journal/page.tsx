import Header from "@/components/common/Header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OurJournal() {
  const journalEntries = [
    {
      title: "On Growth",
      date: "June 1, 2024",
      excerpt: "Today we talked about how much we've both changed since we first met. It's amazing to see how love doesn't just bring two people together, but helps them become better versions of themselves. We've learned to be more patient, more understanding, and more vulnerable with each other."
    },
    {
      title: "Finding Home in Each Other",
      date: "May 15, 2024",
      excerpt: "I realized today that home isn't a place—it's a person. Whether we're in our cozy apartment, traveling to new cities, or just sitting in comfortable silence, I feel most at home when I'm with you. Your presence is my sanctuary, your laugh is my favorite sound echoing through our shared space."
    },
    {
      title: "The Little Things",
      date: "April 22, 2024",
      excerpt: "Sometimes the smallest moments hold the biggest meaning. Like how you always make sure I have my favorite tea ready when I wake up, or the way you unconsciously reach for my hand when we're walking. These tiny gestures of love weave the fabric of our everyday happiness."
    },
    {
      title: "Dreams and Plans",
      date: "March 10, 2024",
      excerpt: "We spent hours today talking about our future—the places we want to visit, the traditions we want to create, the family we hope to build. It's incredible how our individual dreams have started to merge into something even more beautiful: a shared vision of the life we're creating together."
    },
    {
      title: "Learning to Communicate",
      date: "February 28, 2024",
      excerpt: "We had our first real disagreement this week, and while it was difficult, it taught us so much about each other. Learning to fight fair, to listen with our hearts, and to choose love even when we're frustrated—these are the skills that will carry us through a lifetime together."
    },
    {
      title: "Gratitude in the Ordinary",
      date: "January 14, 2024",
      excerpt: "There's something magical about finding joy in the mundane. Grocery shopping together, doing laundry while dancing to music, or just sitting together while we each read our books. These ordinary moments are the ones I treasure most—proof that love makes everything more beautiful."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Our Journal
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Reflections on our journey, moments of growth, and heartfelt words.
          </p>
        </div>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {journalEntries.map((entry, index) => (
            <Card 
              key={index} 
              className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl font-headline text-foreground">
                  {entry.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground font-body">
                  {entry.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="leading-relaxed text-muted-foreground font-body">
                  {entry.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-primary p-0 h-auto font-medium">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

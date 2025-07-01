import Image from "next/image"
import Header from "@/components/common/Header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Photo data structure
const photos = {
  vacations: [
    {
      src: "https://placehold.co/400x400.png",
      alt: "Mountain getaway together",
      hint: "couple mountains"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Beach vacation sunset",
      hint: "beach sunset"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "City exploration adventure",
      hint: "city exploration"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Hiking trail memories",
      hint: "hiking trail"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Camping under the stars",
      hint: "camping stars"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Road trip adventure",
      hint: "road trip"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Lake house weekend",
      hint: "lake house"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "European adventure",
      hint: "europe travel"
    }
  ],
  anniversaries: [
    {
      src: "https://placehold.co/400x400.png",
      alt: "First anniversary dinner",
      hint: "anniversary dinner"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Second year celebration",
      hint: "celebration couple"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Three years of love",
      hint: "romantic celebration"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Anniversary getaway",
      hint: "romantic getaway"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Special anniversary gift",
      hint: "anniversary gift"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Dancing on our anniversary",
      hint: "couple dancing"
    }
  ],
  random: [
    {
      src: "https://placehold.co/400x400.png",
      alt: "Sunday morning coffee",
      hint: "morning coffee"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Cooking together",
      hint: "cooking together"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Movie night at home",
      hint: "movie night"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Walk in the park",
      hint: "park walk"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Playing with our pet",
      hint: "couple pet"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Grocery shopping together",
      hint: "grocery shopping"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Reading together",
      hint: "reading together"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Game night fun",
      hint: "game night"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Spontaneous adventure",
      hint: "spontaneous fun"
    },
    {
      src: "https://placehold.co/400x400.png",
      alt: "Lazy weekend morning",
      hint: "lazy morning"
    }
  ]
}

// PhotoGrid component
interface PhotoGridProps {
  album: Array<{
    src: string
    alt: string
    hint: string
  }>
}

function PhotoGrid({ album }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {album.map((photo, index) => (
        <Card key={index} className="group overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
          <div className="aspect-square relative">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={photo.hint}
            />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function PhotoAlbums() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Photo Albums
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            A collection of moments captured forever.
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="vacations" className="w-full">
          <TabsList className="max-w-md mx-auto mb-8">
            <TabsTrigger value="vacations" className="flex-1">
              Vacations
            </TabsTrigger>
            <TabsTrigger value="anniversaries" className="flex-1">
              Anniversaries
            </TabsTrigger>
            <TabsTrigger value="random" className="flex-1">
              Random Days
            </TabsTrigger>
          </TabsList>

          {/* Photo Grid Content */}
          <TabsContent value="vacations" className="mt-8">
            <PhotoGrid album={photos.vacations} />
          </TabsContent>

          <TabsContent value="anniversaries" className="mt-8">
            <PhotoGrid album={photos.anniversaries} />
          </TabsContent>

          <TabsContent value="random" className="mt-8">
            <PhotoGrid album={photos.random} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

import Image from "next/image"
import Header from "@/components/common/Header"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { PenSquare } from "lucide-react"

export default function LoveNotes() {
  const notes = [
    {
      type: "typed",
      title: "A Typed Note",
      content: "My dearest love, every morning I wake up grateful for another day to love you. Your laugh is my favorite sound, your smile my favorite sight. Thank you for being my person, my home, my everything. Forever yours.",
      rotation: "-2deg"
    },
    {
      type: "handwritten",
      title: "Handwritten",
      content: null,
      rotation: "3deg"
    },
    {
      type: "typed",
      title: "Another Sweet Message",
      content: "I love the way you steal the covers, leave coffee rings on the table, and sing off-key in the shower. I love your messy hair in the morning and the way you dance while cooking. I love all your perfect imperfections.",
      rotation: "-1deg"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Love Notes
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            The words we've shared, kept close to the heart.
          </p>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {notes.map((note, index) => (
            <InteractiveCard 
              key={index} 
              rotation={note.rotation}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
                  <PenSquare className="h-5 w-5 text-primary" />
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {note.type === "typed" ? (
                  <p className="italic leading-relaxed text-muted-foreground font-body">
                    {note.content}
                  </p>
                ) : (
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <div className="relative aspect-[3/2] w-full">
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="Handwritten love letter"
                        fill
                        className="object-cover rounded"
                        data-ai-hint="handwritten letter"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </InteractiveCard>
          ))}
        </div>

        {/* Additional scattered notes for visual appeal */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <InteractiveCard rotation="2deg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
                <PenSquare className="h-5 w-5 text-primary" />
                Quick Reminder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="italic leading-relaxed text-muted-foreground font-body">
                Don't forget: You're amazing, you're loved, and you make my world brighter just by being in it. ❤️
              </p>
            </CardContent>
          </InteractiveCard>

          <InteractiveCard rotation="-3deg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline text-foreground">
                <PenSquare className="h-5 w-5 text-primary" />
                Future Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="italic leading-relaxed text-muted-foreground font-body">
                Can't wait to grow old with you, to see your face every morning for the rest of my life, and to write a million more love notes together.
              </p>
            </CardContent>
          </InteractiveCard>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const poemFormSchema = z.object({
  relationshipDetails: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Please keep it under 500 characters"),
  tone: z.enum(["romantic", "funny", "sentimental"], {
    required_error: "Please select a tone",
  }),
  length: z.enum(["short", "medium", "long"], {
    required_error: "Please select a length",
  }),
})

type PoemFormValues = z.infer<typeof poemFormSchema>

export default function PoemGenerator() {
  const [poem, setPoem] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<PoemFormValues>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      relationshipDetails: "",
      tone: undefined,
      length: undefined,
    },
  })

  const onSubmit = async (values: PoemFormValues) => {
    setIsLoading(true)
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate a personalized poem based on the form values
      const poemTemplate = generatePoem(values)
      setPoem(poemTemplate)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Our digital poet seems to have writer's block. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generatePoem = (values: PoemFormValues) => {
    const { tone, length, relationshipDetails } = values
    
    let poemLines = []
    
    if (tone === "romantic") {
      if (length === "short") {
        poemLines = [
          "In your eyes I find my home,",
          "Where love and dreams together roam.",
          `${relationshipDetails.split(' ').slice(0, 3).join(' ')} brings us close,`,
          "A love that matters most."
        ]
      } else if (length === "medium") {
        poemLines = [
          "Your smile lights up my darkest days,",
          "In countless beautiful ways.",
          `${relationshipDetails.split(' ').slice(0, 4).join(' ')} we share,`,
          "Shows how much you truly care.",
          "",
          "Together we write our story sweet,",
          "Making every moment complete.",
          "With you, my heart has found its place,",
          "In love's eternal embrace."
        ]
      } else {
        poemLines = [
          "In the garden of our love so true,",
          "Where every moment feels brand new,",
          `${relationshipDetails.split(' ').slice(0, 5).join(' ')} reminds me why`,
          "Our love reaches beyond the sky.",
          "",
          "Your laughter echoes in my heart,",
          "A melody that won't depart.",
          "Through seasons changing, we remain,",
          "Dancing together in sunshine and rain.",
          "",
          "Hand in hand we face each day,",
          "Love lighting up our chosen way.",
          "Forever yours, forever mine,",
          "Two hearts beating in perfect rhyme."
        ]
      }
    } else if (tone === "funny") {
      if (length === "short") {
        poemLines = [
          "You steal my fries, you steal my heart,",
          "Been doing that right from the start.",
          `${relationshipDetails.split(' ').slice(0, 3).join(' ')} makes me grin,`,
          "With you, I always win!"
        ]
      } else if (length === "medium") {
        poemLines = [
          "You leave your socks upon the floor,",
          "I trip and tumble, love you more!",
          `${relationshipDetails.split(' ').slice(0, 4).join(' ')} we do,`,
          "Shows life's more fun when shared with you.",
          "",
          "Your morning hair's a sight to see,",
          "But you're still perfect, dear, to me.",
          "Though you may snore and hog the bed,",
          "I'd choose you daily, sleepyhead!"
        ]
      } else {
        poemLines = [
          "We're quite the pair, we must admit,",
          "With quirks and habits that don't quit.",
          `${relationshipDetails.split(' ').slice(0, 5).join(' ')} shows`,
          "How wonderfully our weirdness flows.",
          "",
          "You sing off-key but with such joy,",
          "Like love's own personal envoy.",
          "You dance like no one's watching when",
          "You think I'm not looking, but I grin.",
          "",
          "Together we're beautifully strange,",
          "A love that time will never change.",
          "So here's to us, our silly ways,",
          "And to our goofy, loving days!"
        ]
      }
    } else { // sentimental
      if (length === "short") {
        poemLines = [
          "In quiet moments, I remember",
          "Every precious day together.",
          `${relationshipDetails.split(' ').slice(0, 3).join(' ')} holds dear`,
          "Memories I'll always revere."
        ]
      } else if (length === "medium") {
        poemLines = [
          "Time has woven our hearts as one,",
          "Through setting moon and rising sun.",
          `${relationshipDetails.split(' ').slice(0, 4).join(' ')} we've built`,
          "A love without any guilt.",
          "",
          "In gentle whispers, soft and low,",
          "Our deepest feelings freely flow.",
          "Each memory a precious gem,",
          "In love's eternal diadem."
        ]
      } else {
        poemLines = [
          "Through years of joy and tears we've shared,",
          "A bond so strong, beyond compare.",
          `${relationshipDetails.split(' ').slice(0, 5).join(' ')} reminds me of`,
          "The depth and breadth of our true love.",
          "",
          "In quiet corners of my mind,",
          "Your gentle spirit I always find.",
          "A guiding light through storm and strife,",
          "You are the treasure of my life.",
          "",
          "As seasons pass and years unfold,",
          "Our story's worth its weight in gold.",
          "Forever grateful, forever true,",
          "My heart belongs forever to you."
        ]
      }
    }
    
    return poemLines.join('\n')
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">Create a Poem</CardTitle>
        <CardDescription className="text-center font-body">
          Share details about your relationship and let our AI craft a personalized poem just for you both
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="relationshipDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Relationship Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., our first date at the Italian restaurant where we talked for hours about our dreams..."
                      className="min-h-[100px] font-body"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body">Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="romantic">Romantic</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="sentimental">Sentimental</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body">Length</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conjuring a Masterpiece...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Poem
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      {isLoading && (
        <CardFooter className="justify-center">
          <div className="flex items-center gap-2 text-muted-foreground font-body">
            <Loader2 className="h-4 w-4 animate-spin" />
            Our digital poet is dipping their quill in ink...
          </div>
        </CardFooter>
      )}
      
      {poem && !isLoading && (
        <CardFooter>
          <Card className="w-full bg-muted/50 border-accent">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-center">A Verse for Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-center italic leading-relaxed font-serif">
                {poem}
              </p>
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  )
}

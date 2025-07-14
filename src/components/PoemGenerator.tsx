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
import { useToast } from "@/components/ui/use-toast"

const poemFormSchema = z.object({
  relationshipDetails: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Please keep it under 500 characters")
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
    } catch {
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
    const { relationshipDetails } = values
    
    // Create a medium-length poem that incorporates the relationship details
    const poemLines = [
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

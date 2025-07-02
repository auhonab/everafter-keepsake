"use client"

import { useState, useEffect } from "react"
import Header from "@/components/common/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, MapPin, Loader2, Info } from "lucide-react"
import { api } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import EditableContent from "@/components/ui/editable-content"
import { formatDate } from "@/lib/utils"

interface Memory {
  _id: string
  title: string
  description?: string
  images: string[]
  date: string
  location?: string
  coordinates?: {
    lat: number
    lng: number
  }
  tags?: string[]
}

// Function to geocode location strings to coordinates
async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // This would normally use a real geocoding API like Google Maps, Mapbox, etc.
    // For now, we'll return random coordinates to simulate the functionality
    return {
      lat: 40 + (Math.random() * 10 - 5),
      lng: -100 + (Math.random() * 20 - 10)
    }
  } catch (error) {
    console.error("Error geocoding location:", error)
    return null
  }
}

export default function MemoryMap() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      setIsLoading(true)
      const response = await api.getMemories()
      const fetchedMemories = (response as any).memories || []
      
      // Filter memories that have location data
      const memoriesWithLocation = fetchedMemories.filter((memory: Memory) => memory.location)
      
      // Process memories to add coordinates
      const processedMemories = await Promise.all(
        memoriesWithLocation.map(async (memory: Memory) => {
          if (memory.location && !memory.coordinates) {
            const coords = await geocodeLocation(memory.location)
            return { ...memory, coordinates: coords }
          }
          return memory
        })
      )
      
      setMemories(processedMemories)
    } catch (error) {
      console.error('Error loading memories with locations:', error)
      toast({
        title: "Error loading memory map",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMemory = async (id: string, data: any) => {
    try {
      const response = await api.updateMemory(id, data)
      const updatedMemory = (response as any).memory
      
      setMemories(memories.map(memory => 
        memory._id === id ? { ...updatedMemory } : memory
      ))
      
      if (selectedMemory?._id === id) {
        setSelectedMemory(updatedMemory)
      }
      
      toast({
        title: "Memory updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error('Error updating memory:', error)
      toast({
        title: "Error updating memory",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  // A placeholder for the map component
  const MapPlaceholder = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-muted/20 rounded-lg">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p>Loading memory locations...</p>
        </div>
      )
    }
    
    if (memories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-muted/20 rounded-lg">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground max-w-md px-4">
            No memories with location data found. Add location information to your memories to see them on this map.
          </p>
        </div>
      )
    }
    
    // This would normally render a real map component using libraries like Leaflet, Google Maps, etc.
    // For now, we'll show a placeholder with memory markers
    return (
      <div className="relative h-[500px] bg-blue-50 rounded-lg overflow-hidden">
        {/* Placeholder map background image */}
        <Image 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
          alt="Map background"
          fill
          className="object-cover opacity-50"
        />
        
        {/* Memory markers */}
        {memories.map((memory) => (
          <button
            key={memory._id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all
                      ${selectedMemory?._id === memory._id ? 'z-10 scale-125' : 'z-0 hover:scale-110'}`}
            style={{ 
              top: `${memory.coordinates ? ((memory.coordinates.lat - 35) / 10) * 100 : 50}%`, 
              left: `${memory.coordinates ? ((memory.coordinates.lng + 110) / 20) * 100 : 50}%` 
            }}
            onClick={() => setSelectedMemory(memory)}
          >
            <div className="flex flex-col items-center">
              <MapPin 
                className={`h-8 w-8 ${selectedMemory?._id === memory._id ? 'text-primary fill-primary' : 'text-primary'}`} 
              />
              <span className="text-xs font-semibold bg-background/80 px-2 py-1 rounded-md shadow-sm mt-1">
                {memory.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Map of Memories
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Charting our journey, one pin at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Memory Map */}
          <div className="md:col-span-2">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Our Memory Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapPlaceholder />
              </CardContent>
            </Card>
          </div>
          
          {/* Memory Details */}
          <div className="md:col-span-1">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle>
                  {selectedMemory ? 'Memory Details' : 'Select a Memory'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedMemory ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Click on a pin on the map to view memory details
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedMemory.images && selectedMemory.images[0] && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={selectedMemory.images[0]}
                          alt={selectedMemory.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div>
                      <EditableContent
                        type="title"
                        value={selectedMemory.title}
                        onSave={(value) => handleUpdateMemory(selectedMemory._id, { title: String(value) })}
                        className="font-bold text-xl"
                      />
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        <EditableContent
                          type="text"
                          value={selectedMemory.location || ""}
                          onSave={(value) => handleUpdateMemory(selectedMemory._id, { location: String(value) })}
                          placeholder="Add a location"
                        />
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDate(new Date(selectedMemory.date))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <EditableContent
                        type="textarea"
                        value={selectedMemory.description || ""}
                        onSave={(value) => handleUpdateMemory(selectedMemory._id, { description: String(value) })}
                        className="text-sm text-muted-foreground"
                        placeholder="Add a description for this memory..."
                      />
                    </div>
                    
                    {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedMemory.tags.map((tag, i) => (
                            <span 
                              key={i}
                              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

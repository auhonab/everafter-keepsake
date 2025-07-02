"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/common/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Map, MapPin, Loader2, Info, Filter, Calendar, Navigation, Search, Plus, Edit, Trash2 } from "lucide-react"
import { api } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import EditableContent from "@/components/ui/editable-content"
import CreateMemoryModal from "@/components/ui/create-memory-modal"
import EditMemoryModal from "@/components/ui/edit-memory-modal"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { formatDate } from "@/lib/utils"

// Dynamically import the map component to avoid SSR issues
const InteractiveMemoryMap = dynamic(() => import('@/components/ui/memory-map'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[500px] bg-muted/20 rounded-lg">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p>Loading interactive map...</p>
    </div>
  )
})

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
  locationName?: string
  tags?: string[]
}

// Geocoding function using Nominatim (free)
async function geocodeLocation(location: string): Promise<{ lat: number; lng: number; name: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`
    )
    const data = await response.json()
    
    if (data.length > 0) {
      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name
      }
    }
    return null
  } catch (error) {
    console.error("Error geocoding location:", error)
    return null
  }
}

export default function MemoryMap() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [locationFilter, setLocationFilter] = useState('')
  const [selectedMapLocation, setSelectedMapLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      setIsLoading(true)
      const response = await api.getMemories()
      const fetchedMemories = (response as any).memories || []
      
      // Process memories to ensure they have proper coordinate data
      const processedMemories = await Promise.all(
        fetchedMemories.map(async (memory: Memory) => {
          // If memory has location but no coordinates, try to geocode
          if (memory.location && !memory.coordinates) {
            const coords = await geocodeLocation(memory.location)
            if (coords) {
              return { 
                ...memory, 
                coordinates: { lat: coords.lat, lng: coords.lng },
                locationName: coords.name 
              }
            }
          }
          return memory
        })
      )
      
      setMemories(processedMemories)
    } catch (error) {
      console.error('Error loading memories:', error)
      toast({
        title: "Error loading memories",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMemory = async (id: string, data: any) => {
    try {
      // If location is being updated, geocode it
      if (data.location && typeof data.location === 'string') {
        const coords = await geocodeLocation(data.location)
        if (coords) {
          data.coordinates = { lat: coords.lat, lng: coords.lng }
          data.locationName = coords.name
        }
      }

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

  // Filter memories based on date range and location
  const filteredMemories = memories.filter(memory => {
    let matchesDate = true
    let matchesLocation = true

    if (dateRange.start) {
      matchesDate = matchesDate && new Date(memory.date) >= new Date(dateRange.start)
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(memory.date) <= new Date(dateRange.end)
    }

    if (locationFilter) {
      const searchTerm = locationFilter.toLowerCase()
      matchesLocation = 
        (memory.location?.toLowerCase().includes(searchTerm) || false) ||
        (memory.locationName?.toLowerCase().includes(searchTerm) || false)
    }

    return matchesDate && matchesLocation
  })

  const clearFilters = () => {
    setDateRange({ start: '', end: '' })
    setLocationFilter('')
  }

  const handleDeleteMemory = async (id: string) => {
    setMemoryToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDeleteMemory = async () => {
    if (!memoryToDelete) return

    try {
      await api.deleteMemory(memoryToDelete)
      
      setMemories(memories.filter(memory => memory._id !== memoryToDelete))
      
      if (selectedMemory?._id === memoryToDelete) {
        setSelectedMemory(null)
      }
      
      toast({
        title: "Memory deleted",
        description: "The memory has been permanently removed",
      })
    } catch (error) {
      console.error('Error deleting memory:', error)
      toast({
        title: "Error deleting memory",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setMemoryToDelete(null)
    }
  }

  const handleMemoryCreated = (newMemory: Memory) => {
    setMemories(prev => [...prev, newMemory])
    setSelectedMemory(newMemory)
    setSelectedMapLocation(null)
    toast({
      title: "Memory added to map",
      description: "Your new memory is now visible on the map",
    })
  }

  const handleMemoryUpdated = (updatedMemory: Memory) => {
    setMemories(memories.map(memory => 
      memory._id === updatedMemory._id ? updatedMemory : memory
    ))
    setSelectedMemory(updatedMemory)
    toast({
      title: "Memory updated on map",
      description: "Your changes are now visible on the map",
    })
  }

  const memoriesWithCoordinates = filteredMemories.filter(memory => memory.coordinates)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Memory Map
          </h1>
          <p className="text-lg text-muted-foreground font-body mb-6">
            Explore your memories through their locations and relive the journey.
          </p>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <CreateMemoryModal
              onMemoryCreated={handleMemoryCreated}
              initialLocation={selectedMapLocation}
              open={showCreateModal}
              onOpenChange={setShowCreateModal}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Memory
                </Button>
              }
            />
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            {(dateRange.start || dateRange.end || locationFilter) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="max-w-md mx-auto mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>{filteredMemories.length} total memories</span>
            <span>{memoriesWithCoordinates.length} with locations</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p>Loading your memory map...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Map */}
            <div className="lg:col-span-2">
              <InteractiveMemoryMap
                memories={memoriesWithCoordinates}
                selectedMemory={selectedMemory}
                onMemorySelect={setSelectedMemory}
                onMemoryUpdate={handleUpdateMemory}
                onLocationSelect={(lat, lng, name) => {
                  setSelectedMapLocation({ lat, lng, name })
                  setShowCreateModal(true)
                }}
                onMemoryEdit={(memory) => {
                  setSelectedMemory(memory)
                  setShowEditModal(true)
                }}
                onMemoryDelete={handleDeleteMemory}
              />
            </div>
            
            {/* Memory Details Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {selectedMemory ? 'Memory Details' : 'Select a Memory'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedMemory ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                      <MapPin className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground mb-2">
                          Click on a heart marker on the map to view memory details
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Or click anywhere on the map to add a new memory location
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Action Buttons */}
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMemory(selectedMemory._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>

                      {/* Memory Image */}
                      {selectedMemory.images && selectedMemory.images[0] && (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                          <Image
                            src={selectedMemory.images[0]}
                            alt={selectedMemory.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Memory Info */}
                      <div className="space-y-3">
                        <div>
                          <EditableContent
                            type="title"
                            value={selectedMemory.title}
                            onSave={(value) => handleUpdateMemory(selectedMemory._id, { title: String(value) })}
                            className="font-bold text-xl mb-2"
                          />
                          
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Calendar className="mr-2 h-3 w-3" />
                            {formatDate(new Date(selectedMemory.date))}
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-2 h-3 w-3" />
                            <EditableContent
                              type="text"
                              value={selectedMemory.locationName || selectedMemory.location || ""}
                              onSave={(value) => handleUpdateMemory(selectedMemory._id, { location: String(value) })}
                              placeholder="Add a location..."
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <EditableContent
                            type="textarea"
                            value={selectedMemory.description || ""}
                            onSave={(value) => handleUpdateMemory(selectedMemory._id, { description: String(value) })}
                            className="text-sm text-muted-foreground min-h-[80px]"
                            placeholder="Add a description for this memory..."
                          />
                        </div>
                        
                        {/* Tags */}
                        {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Tags</h4>
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

                        {/* Coordinates */}
                        {selectedMemory.coordinates && (
                          <div className="pt-2 border-t">
                            <h4 className="text-sm font-medium mb-1">Coordinates</h4>
                            <p className="text-xs text-muted-foreground font-mono">
                              {selectedMemory.coordinates.lat.toFixed(6)}, {selectedMemory.coordinates.lng.toFixed(6)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              How to Use Memory Map
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Viewing Memories</h4>
                <ul className="space-y-1">
                  <li>• Heart markers show memories with locations</li>
                  <li>• Click markers to view memory details</li>
                  <li>• Switch between map and list views</li>
                  <li>• Use filters to find specific memories</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Managing Memories</h4>
                <ul className="space-y-1">
                  <li>• Click "Add Memory" to create new memories</li>
                  <li>• Click anywhere on map to select location</li>
                  <li>• Use Edit button to modify memories</li>
                  <li>• Delete memories with confirmation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Memory Modal */}
        <EditMemoryModal
          memory={selectedMemory}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onMemoryUpdated={handleMemoryUpdated}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Memory"
          description="Are you sure you want to delete this memory? This action cannot be undone and all associated data will be permanently removed."
          confirmText="Delete Memory"
          cancelText="Keep Memory"
          onConfirm={confirmDeleteMemory}
          variant="destructive"
        />
      </main>
    </div>
  )
}

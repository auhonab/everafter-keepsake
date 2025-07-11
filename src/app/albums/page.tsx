"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Header from "@/components/common/Header"
import AuthWrapper from "@/components/AuthWrapper"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Image as ImageIcon, Calendar, MapPin, X } from "lucide-react"
import EditableContent from "@/components/ui/editable-content"
import DeleteButton from "@/components/ui/delete-button"
import ImageUpload from "@/components/ui/image-upload"
import NewEntryCard from "@/components/ui/new-entry-card"
import { api } from "@/hooks/useApi"
import { AlbumPayload } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"

interface Album {
  _id: string
  title: string
  description?: string
  coverImage?: string
  memories: Memory[]
  userId: string
  createdAt: string
}

interface Memory {
  _id: string
  title: string
  description?: string
  images: string[]
  date: string
  location?: string
  tags?: string[]
}

function AlbumsContent() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [openMemoryDialog, setOpenMemoryDialog] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [editingAlbumCover, setEditingAlbumCover] = useState<string | null>(null)
  const [editingMemoryImage, setEditingMemoryImage] = useState<string | null>(null)
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    images: [""],
    date: new Date().toISOString().split('T')[0],
    location: "",
    tags: ""
  })

  const { toast } = useToast()
  
  const loadAlbums = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.getAlbums()
      
      // Access the albums property from the response
      // With our updated API types, it should now consistently be in this format
      const fetchedAlbums = response?.albums || []
      
      // Ensure all date strings can be parsed correctly
      const sanitizedAlbums = fetchedAlbums.map(album => {
        // Create a copy of the album to avoid mutation issues
        const sanitizedAlbum = { ...album } as unknown as Album;
        
        // Handle createdAt date
        if (sanitizedAlbum.createdAt && typeof sanitizedAlbum.createdAt === 'string') {
          try {
            // Validate the date by trying to create a Date object
            new Date(sanitizedAlbum.createdAt);
          } catch {
            console.error('Invalid date format in createdAt:', sanitizedAlbum.createdAt);
            // Use current date as fallback
            sanitizedAlbum.createdAt = new Date().toISOString() as unknown as string;
          }
        }
        
        // Also handle dates in memories if they exist
        if (Array.isArray(sanitizedAlbum.memories)) {
          sanitizedAlbum.memories = sanitizedAlbum.memories.map((memory: Memory) => {
            if (memory.date && typeof memory.date === 'string') {
              try {
                new Date(memory.date);
              } catch {
                console.error('Invalid date format in memory:', memory.date);
                memory.date = new Date().toISOString();
              }
            }
            return memory;
          });
        } else {
          // Ensure memories is always an array
          sanitizedAlbum.memories = [];
        }
        
        return sanitizedAlbum;
      });
      
      setAlbums(sanitizedAlbums)
      
      // Set the first album as active if we have any
      if (sanitizedAlbums.length > 0 && !activeTab) {
        setActiveTab(sanitizedAlbums[0]._id)
      }
    } catch (error) {
      console.error('Error loading albums:', error)
      toast({
        title: "Error loading albums",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, toast])
  
  useEffect(() => {
    loadAlbums()
  }, [loadAlbums])
  
  const handleCreateAlbum = async (data: { title: string; content?: string; image?: string }) => {
    try {
      console.log('Creating album with data:', data);
      const response = await api.createAlbum({
        title: data.title,
        description: data.content,
        coverImage: data.image
      })
      
      console.log('Album creation response:', response);
      
      // Properly extract the album from the response
      // The API returns { album: Album } structure
      const newAlbum = response && typeof response === 'object' && 'album' in response 
        ? ((response as Record<string, unknown>).album as Album) 
        : (response as unknown as Album);
      
      // Ensure we have a valid album object
      if (!newAlbum || typeof newAlbum !== 'object') {
        throw new Error('Invalid album data received from server');
      }
      
      // Ensure dates are properly handled
      if (newAlbum.createdAt && typeof newAlbum.createdAt === 'string') {
        try {
          // Make sure we can parse the date without errors
          new Date(newAlbum.createdAt);
        } catch {
          console.error('Invalid date format in createdAt:', newAlbum.createdAt);
          // Use current date as fallback
          newAlbum.createdAt = new Date().toISOString();
        }
      }
      
      // Ensure memories array exists
      if (!Array.isArray(newAlbum.memories)) {
        newAlbum.memories = [];
      }
      
      // Update the state with the new album
      setAlbums(currentAlbums => [...currentAlbums, newAlbum]);
      setActiveTab(newAlbum._id);
      
      toast({
        title: "Album created",
        description: "Your new photo album has been created",
      })
    } catch (error) {
      console.error('Error creating album:', error)
      toast({
        title: "Error creating album",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleUpdateAlbum = async (id: string, data: Partial<Album>) => {
    try {
      // Convert memories array to string IDs if present
      const payload: Partial<AlbumPayload> = {
        ...data,
        memories: data.memories?.map(m => m._id)
      };
      
      const response = await api.updateAlbum(id, payload)
      
      // Properly extract the album from the response
      const updatedAlbum = response && typeof response === 'object' && 'album' in response 
        ? ((response as Record<string, unknown>).album as Album)
        : (response as unknown as Album);
      
      // Ensure we have a valid album object
      if (!updatedAlbum || typeof updatedAlbum !== 'object') {
        throw new Error('Invalid album data received from server');
      }
      
      setAlbums(currentAlbums => 
        currentAlbums.map(album => album._id === id ? updatedAlbum : album)
      )
      
      toast({
        title: "Album updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error('Error updating album:', error)
      toast({
        title: "Error updating album",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteAlbum = async (id: string) => {
    try {
      await api.deleteAlbum(id)
      
      const updatedAlbums = albums.filter(album => album._id !== id)
      setAlbums(updatedAlbums)
      
      // If we deleted the active tab, select the first available album
      if (activeTab === id) {
        setActiveTab(updatedAlbums.length > 0 ? updatedAlbums[0]._id : null)
      }
      
      toast({
        title: "Album deleted",
        description: "Your album has been removed",
      })
    } catch (error) {
      console.error('Error deleting album:', error)
      toast({
        title: "Error deleting album",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleAddMemory = (album: Album) => {
    setSelectedAlbum(album)
    setOpenMemoryDialog(true)
  }

  const handleMemoryImageUpload = (url: string) => {
    console.log('Memory image uploaded:', url);
    setNewMemory(prev => ({
      ...prev,
      images: url ? [url] : [""] // Make sure we have a valid image URL or an empty placeholder
    }))
  }
  
  const handleCreateMemory = async () => {
    if (!selectedAlbum) return
    
    try {
      // Make sure we're sending a valid date format
      let dateValue = newMemory.date;
      
      // Ensure we have a valid date string in YYYY-MM-DD format
      if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // This format is already correct
      } else {
        // Fallback to current date in YYYY-MM-DD format
        dateValue = new Date().toISOString().split('T')[0];
      }
      
      console.log('Creating memory with data:', {
        title: newMemory.title,
        description: newMemory.description,
        date: dateValue,
        images: newMemory.images.filter(img => img),
        location: newMemory.location,
        tags: newMemory.tags ? newMemory.tags.split(',').map(tag => tag.trim()) : []
      });
      
      // Create the memory
      const response = await api.createMemory({
        title: newMemory.title,
        description: newMemory.description,
        date: dateValue,
        images: newMemory.images.filter(img => img), // Filter out empty strings
        location: newMemory.location,
        tags: newMemory.tags ? newMemory.tags.split(',').map(tag => tag.trim()) : []
      })
      
      console.log('Memory creation response:', response);
      
      // Extract the memory from the response - handle different response structures
      const createdMemory = response && typeof response === 'object' && 'memory' in response 
        ? (response as { memory: Memory }).memory
        : (response as unknown as Memory)
      
      if (!createdMemory || !createdMemory._id) {
        throw new Error('Failed to create memory - invalid response from API');
      }
      
      // Update the album to include this memory
      const albumResponse = await api.updateAlbum(selectedAlbum._id, {
        memories: [...(selectedAlbum.memories || []).map(m => m._id), createdMemory._id]
      })
      
      // Extract the updated album from the response
      const updatedAlbum = albumResponse && typeof albumResponse === 'object' && 'album' in albumResponse 
        ? ((albumResponse as unknown) as { album: Album }).album
        : (albumResponse as unknown as Album)
        
      // Important: The album response from the API might not include the full memory objects with images,
      // so we need to manually ensure the newly created memory is included with all its data
      if (updatedAlbum && Array.isArray(updatedAlbum.memories)) {
        // Create a map of existing memories for easy lookup
        const existingMemoriesMap = new Map(
          updatedAlbum.memories
            .filter(m => typeof m === 'object')
            .map(m => [m._id, m])
        );
        
        // If the newly created memory is not in the updated album's memories (or missing data),
        // we need to add it or ensure it has complete data
        if (!existingMemoriesMap.has(createdMemory._id) || 
            !existingMemoriesMap.get(createdMemory._id)?.images?.length) {
          // Either add the memory or update it with complete data
          const updatedMemories = [...updatedAlbum.memories];
          const memoryIndex = updatedMemories.findIndex(m => 
            typeof m === 'object' && m._id === createdMemory._id
          );
          
          if (memoryIndex >= 0) {
            // Memory exists but might be missing data - update it
            updatedMemories[memoryIndex] = createdMemory;
          } else {
            // Memory doesn't exist - add it
            updatedMemories.push(createdMemory);
          }
          
          updatedAlbum.memories = updatedMemories;
        }
      }
      
      // Update local state with functional form to ensure latest state
      setAlbums(currentAlbums => 
        currentAlbums.map(album => 
          album._id === selectedAlbum._id ? updatedAlbum : album
        )
      )
      
      // Reset form and close dialog
      setNewMemory({
        title: "",
        description: "",
        images: [""],
        date: new Date().toISOString().split('T')[0],
        location: "",
        tags: ""
      })
      setOpenMemoryDialog(false)
      
      toast({
        title: "Memory added",
        description: "Your memory has been added to the album",
      })
    } catch (error) {
      console.error('Error adding memory:', error)
      toast({
        title: "Error adding memory",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleUpdateMemory = async (id: string, data: Partial<Memory>) => {
    try {
      const response = await api.updateMemory(id, data)
      const updatedMemory = response as unknown as Memory
      
      // Ensure we have the images array properly preserved
      if (data.images && !updatedMemory.images) {
        updatedMemory.images = data.images;
      }
      
      // Update the memory in its album using functional form for latest state
      setAlbums(currentAlbums => currentAlbums.map(album => {
        if (!album.memories) return album
        
        const memoryIndex = album.memories.findIndex(m => m._id === id)
        if (memoryIndex === -1) return album
        
        const updatedMemories = [...album.memories]
        // Merge the updated memory with existing memory data to preserve any fields
        // that might not be returned by the API
        updatedMemories[memoryIndex] = {
          ...updatedMemories[memoryIndex],
          ...updatedMemory
        }
        
        return {
          ...album,
          memories: updatedMemories
        }
      }))
      
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
  
  const handleDeleteMemory = async (memoryId: string, albumId: string) => {
    try {
      // Delete the memory
      await api.deleteMemory(memoryId)
      
      // Find the album and update it locally
      const albumToUpdate = albums.find(album => album._id === albumId)
      if (!albumToUpdate || !albumToUpdate.memories) return
      
      const updatedMemories = albumToUpdate.memories.filter(m => m._id !== memoryId)
      
      // Also update the album to remove the reference
      await api.updateAlbum(albumId, {
        memories: updatedMemories.map(m => m._id)
      })
      
      // Update local state
      setAlbums(albums.map(album => {
        if (album._id !== albumId) return album
        return {
          ...album,
          memories: updatedMemories
        }
      }))
      
      toast({
        title: "Memory deleted",
        description: "The memory has been removed from the album",
      })
    } catch (error) {
      console.error('Error deleting memory:', error)
      toast({
        title: "Error deleting memory",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const renderMemoryGrid = (memories: Memory[] = []) => {
    // Filter out any invalid memory objects that might be in the array
    const validMemories = memories.filter(memory => 
      memory && typeof memory === 'object' && memory._id && memory.title
    );
    
    if (!validMemories.length) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No memories in this album yet.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validMemories.map((memory) => (
          <Card key={memory._id} className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div 
              className="relative aspect-[3/2] cursor-pointer group"
              onClick={() => setEditingMemoryImage(editingMemoryImage === memory._id ? null : memory._id)}
            >
              {memory.images && memory.images[0] ? (
                <Image
                  src={memory.images[0]}
                  alt={memory.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Edit overlay - only show when hovering or editing */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-sm font-medium">
                  {editingMemoryImage === memory._id ? 'Cancel' : 'Change Photo'}
                </div>
              </div>
              
              {/* Image upload - only show when editing */}
              {editingMemoryImage === memory._id && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <div className="relative">
                    <button
                      onClick={() => setEditingMemoryImage(null)}
                      className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white p-1 rounded-full z-10"
                      aria-label="Cancel editing"
                    >
                      <X size={16} />
                    </button>
                    <ImageUpload
                      defaultImage={memory.images?.[0] || ''}
                      onImageUploaded={(url) => {
                        if (url === '') {
                          // Handle image removal
                          handleUpdateMemory(memory._id, { images: [] })
                        } else {
                          // Handle image upload
                          handleUpdateMemory(memory._id, { images: [url] })
                        }
                        setEditingMemoryImage(null)
                      }}
                      height={180}
                      width={300}
                      caption="Upload Photo"
                      editMode={true}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex-1">
                <EditableContent
                  type="title"
                  value={memory.title}
                  onSave={(value) => handleUpdateMemory(memory._id, { title: String(value) })}
                  className="card-title"
                />
                
                <div className="flex flex-wrap gap-1 mt-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    <time dateTime={memory.date}>
                      {formatDate(memory.date)}
                    </time>
                  </div>
                  
                  {memory.location && (
                    <div className="flex items-center text-xs text-muted-foreground ml-2">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>{memory.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <DeleteButton 
                  onDelete={async () => {
                    const album = albums.find(a => a._id === activeTab)
                    if (album) await handleDeleteMemory(memory._id, album._id)
                  }}
                />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {memory.description && (
                <EditableContent
                  type="textarea"
                  value={memory.description}
                  onSave={(value) => handleUpdateMemory(memory._id, { description: String(value) })}
                  className="text-sm text-muted-foreground"
                />
              )}
              
              {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {memory.tags.map((tag, idx) => (
                    <div key={idx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      #{tag}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render album tabs
  const renderAlbumTabs = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <div className="animate-pulse">Loading albums...</div>
        </div>
      )
    }

    if (albums.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No albums yet. Create your first album to get started!</p>
        </div>
      )
    }

    return (
      <Tabs value={activeTab || ""} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Albums</h2>
        </div>
        
        <TabsList className="mb-8 overflow-x-auto flex w-full bg-muted p-1 rounded-lg">
          {albums.map(album => (
            <TabsTrigger 
              key={album._id} 
              value={album._id} 
              className="flex-shrink-0 px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border hover:bg-background/50"
            >
              {album.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Album Content */}
        {albums.map(album => (
          <TabsContent key={album._id} value={album._id} className="space-y-6">
            {/* Album Title with Active Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{album.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {album.memories?.length || 0} {album.memories?.length === 1 ? 'memory' : 'memories'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Album Details */}
              <div className="w-full md:w-1/3">
                <Card className="h-full">
                  <div 
                    className="relative aspect-square cursor-pointer group"
                    onClick={() => setEditingAlbumCover(editingAlbumCover === album._id ? null : album._id)}
                  >
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Edit overlay - only show when hovering or editing */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-sm font-medium">
                        {editingAlbumCover === album._id ? 'Cancel' : 'Change Cover'}
                      </div>
                    </div>
                            {/* Image upload - only show when editing */}
              {editingAlbumCover === album._id && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <div className="relative">
                    <button
                      onClick={() => setEditingAlbumCover(null)}
                      className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white p-1 rounded-full z-10"
                      aria-label="Cancel editing"
                    >
                      <X size={16} />
                    </button>
                    <ImageUpload
                      defaultImage={album.coverImage}
                      onImageUploaded={(url) => {
                        if (url === '') {
                          // Handle image removal
                          handleUpdateAlbum(album._id, { coverImage: '' })
                        } else {
                          // Handle image upload
                          handleUpdateAlbum(album._id, { coverImage: url })
                        }
                        setEditingAlbumCover(null)
                      }}
                      height={200}
                      width={200}
                      caption="Upload Cover"
                      editMode={true}
                    />
                  </div>
                </div>
              )}
                  </div>
                  
                  <CardContent className="pt-4">
                    <EditableContent
                      type="title"
                      value={album.title}
                      onSave={(value) => handleUpdateAlbum(album._id, { title: String(value) })}
                      className="text-xl font-bold"
                    />
                    
                    <div className="text-sm text-muted-foreground mt-1">
                      Created {formatDate(album.createdAt)}
                    </div>
                    
                    <div className="mt-4">
                      <EditableContent
                        type="textarea"
                        value={album.description || ""}
                        onSave={(value) => handleUpdateAlbum(album._id, { description: String(value) })}
                        className="text-sm"
                        placeholder="Add a description for this album..."
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddMemory(album)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Memory
                    </Button>
                    <DeleteButton 
                      onDelete={() => handleDeleteAlbum(album._id)}
                      confirmText="Delete Album?"
                      size="sm"
                    />
                  </CardFooter>
                </Card>
              </div>
              
              {/* Album Memories */}
              <div className="w-full md:w-2/3">
                {renderMemoryGrid(album.memories)}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    )
  }

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

        {/* Create Album Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <NewEntryCard 
            onSubmit={handleCreateAlbum}
            title="Create New Album"
            includeContent={true}
            includeImage={true}
            buttonText="Create Album"
            layout="horizontal"
          />
        </div>

        {/* Album Content */}
        {renderAlbumTabs()}
        
        {/* Add Memory Dialog */}
        <Dialog open={openMemoryDialog} onOpenChange={setOpenMemoryDialog}>
          <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Memory</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="memoryTitle" className="text-sm font-medium">Title</label>
                  <Input 
                    id="memoryTitle" 
                    value={newMemory.title} 
                    onChange={(e) => setNewMemory({...newMemory, title: e.target.value})}
                    placeholder="Enter a title for this memory"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="memoryDate" className="text-sm font-medium">Date</label>
                    <Input 
                      id="memoryDate" 
                      type="date" 
                      value={newMemory.date} 
                      onChange={(e) => setNewMemory({...newMemory, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="memoryLocation" className="text-sm font-medium">Location</label>
                    <Input 
                      id="memoryLocation" 
                      value={newMemory.location} 
                      onChange={(e) => setNewMemory({...newMemory, location: e.target.value})}
                      placeholder="Where did this memory take place?"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="memoryDescription" className="text-sm font-medium">Description</label>
                  <Textarea 
                    id="memoryDescription" 
                    value={newMemory.description} 
                    onChange={(e) => setNewMemory({...newMemory, description: e.target.value})}
                    placeholder="Tell the story behind this memory..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="memoryTags" className="text-sm font-medium">Tags</label>
                  <Input 
                    id="memoryTags" 
                    value={newMemory.tags} 
                    onChange={(e) => setNewMemory({...newMemory, tags: e.target.value})}
                    placeholder="Tags separated by commas (e.g. vacation, beach, sunset)"
                  />
                </div>
              </div>
              
              {/* Right Column - Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <ImageUpload
                    onImageUploaded={handleMemoryImageUpload}
                    height={280}
                    width={400}
                    caption="Upload Image"
                    editMode={true}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpenMemoryDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateMemory} 
                disabled={!newMemory.title.trim() || !newMemory.date}
              >
                Add Memory
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default function PhotoAlbums() {
  return (
    <AuthWrapper>
      <AlbumsContent />
    </AuthWrapper>
  )
}

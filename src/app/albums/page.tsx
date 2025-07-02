"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/common/Header"
import AuthWrapper from "@/components/AuthWrapper"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Pen, Trash2, Plus, Image as ImageIcon, Calendar, MapPin, Tag, Loader2, X } from "lucide-react"
import EditableContent from "@/components/ui/editable-content"
import DeleteButton from "@/components/ui/delete-button"
import ImageUpload from "@/components/ui/image-upload"
import NewEntryCard from "@/components/ui/new-entry-card"
import EditableCard from "@/components/ui/editable-card"
import { api } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  
  useEffect(() => {
    loadAlbums()
  }, [])
  
  const loadAlbums = async () => {
    try {
      setIsLoading(true)
      const response = await api.getAlbums()
      const fetchedAlbums = (response as any).albums || []
      setAlbums(fetchedAlbums)
      
      // Set the first album as active if we have any
      if (fetchedAlbums.length > 0 && !activeTab) {
        setActiveTab(fetchedAlbums[0]._id)
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
  }
  
  const handleCreateAlbum = async (data: { title: string; content?: string; image?: string }) => {
    try {
      const response = await api.createAlbum({
        title: data.title,
        description: data.content,
        coverImage: data.image
      })
      
      const newAlbum = (response as any).album
      setAlbums([...albums, newAlbum])
      setActiveTab(newAlbum._id)
      
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
  
  const handleUpdateAlbum = async (id: string, data: any) => {
    try {
      const response = await api.updateAlbum(id, data)
      
      setAlbums(albums.map(album => 
        album._id === id ? (response as any).album : album
      ))
      
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
      images: [url]
    }))
  }
  
  const handleCreateMemory = async () => {
    if (!selectedAlbum) return
    
    try {
      console.log('Creating memory with data:', {
        title: newMemory.title,
        description: newMemory.description,
        date: newMemory.date,
        images: newMemory.images.filter(img => img),
        location: newMemory.location,
        tags: newMemory.tags ? newMemory.tags.split(',').map(tag => tag.trim()) : []
      });
      
      // Create the memory
      const response = await api.createMemory({
        title: newMemory.title,
        description: newMemory.description,
        date: newMemory.date,
        images: newMemory.images.filter(img => img), // Filter out empty strings
        location: newMemory.location,
        tags: newMemory.tags ? newMemory.tags.split(',').map(tag => tag.trim()) : []
      })
      
      console.log('Memory creation response:', response);
      
      const createdMemory = (response as any).memory
      
      // Update the album to include this memory
      const albumResponse = await api.updateAlbum(selectedAlbum._id, {
        memories: [...(selectedAlbum.memories || []).map(m => m._id), createdMemory._id]
      })
      
      // Update local state
      setAlbums(albums.map(album => 
        album._id === selectedAlbum._id ? (albumResponse as any).album : album
      ))
      
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

  const handleUpdateMemory = async (id: string, data: any) => {
    try {
      const response = await api.updateMemory(id, data)
      const updatedMemory = (response as any).memory
      
      // Update the memory in its album
      setAlbums(albums.map(album => {
        if (!album.memories) return album
        
        const memoryIndex = album.memories.findIndex(m => m._id === id)
        if (memoryIndex === -1) return album
        
        const updatedMemories = [...album.memories]
        updatedMemories[memoryIndex] = updatedMemory
        
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
    if (!memories.length) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No memories in this album yet.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
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
                      {formatDate(new Date(memory.date))}
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
        
        <TabsList className="mb-8 overflow-x-auto flex w-full">
          {albums.map(album => (
            <TabsTrigger key={album._id} value={album._id} className="flex-shrink-0">
              {album.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Album Content */}
        {albums.map(album => (
          <TabsContent key={album._id} value={album._id} className="space-y-6">
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
                      Created {formatDate(new Date(album.createdAt))}
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
        <div className="max-w-md mx-auto mb-16">
          <NewEntryCard 
            onSubmit={handleCreateAlbum}
            title="Create New Album"
            includeContent={true}
            includeImage={true}
            buttonText="Create Album"
          />
        </div>

        {/* Album Content */}
        {renderAlbumTabs()}
        
        {/* Add Memory Dialog */}
        <Dialog open={openMemoryDialog} onOpenChange={setOpenMemoryDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Memory</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
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
              
              <div className="space-y-2">
                <label htmlFor="memoryDescription" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="memoryDescription" 
                  value={newMemory.description} 
                  onChange={(e) => setNewMemory({...newMemory, description: e.target.value})}
                  placeholder="Tell the story behind this memory..."
                  rows={3}
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <ImageUpload
                  onImageUploaded={handleMemoryImageUpload}
                  height={200}
                  width={400}
                  caption="Upload Image"
                  editMode={true}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
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

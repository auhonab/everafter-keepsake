"use client"

import { useState, useEffect } from "react"

import Header from "@/components/common/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { PenSquare, Heart, PlusCircle } from "lucide-react"
import EditableContent from "@/components/ui/editable-content"
import DeleteButton from "@/components/ui/delete-button"
import NewEntryCard from "@/components/ui/new-entry-card"
import { Button } from "@/components/ui/button"
import { api } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"

interface LoveNote {
  _id: string
  title?: string
  content: string
  sender: any
  recipient: any
  isRead: boolean
  scheduledFor?: string
  style?: string
  createdAt: string

}

export default function LoveNotes() {
  const [notes, setNotes] = useState<LoveNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    loadLoveNotes()
  }, [])
  
  const loadLoveNotes = async () => {
    try {
      setIsLoading(true)
      const response = await api.getLoveNotes()
      // Safely cast the response to the expected type
      const data = response as unknown as { notes: LoveNote[] }
      setNotes(data.notes || [])
    } catch (error) {
      console.error('Error loading love notes:', error)
      toast({
        title: "Error loading love notes",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCreateNote = async (data: { title?: string; content?: string }) => {
    try {
      // For demo purposes, create a note for the same user (self-note)
      // In a real app, we'd get the partner's ID
      const response = await api.createLoveNote({
        title: data.title || "Love Note",
        content: data.content || "",
        recipient: "self", // This will be handled specially in the API
        style: "romantic",
      })
      
      // Safely cast the response to the expected type
      const noteData = response as unknown as { note: LoveNote }
      setNotes([noteData.note, ...notes])
      
      toast({
        title: "Love note sent",
        description: "Your note has been delivered",
      })
    } catch (error) {
      console.error('Error creating love note:', error)
      toast({
        title: "Error sending note",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleUpdateNote = async (id: string, data: any) => {
    try {
      const response = await api.updateLoveNote(id, data)
      
      // Safely cast the response to the expected type
      const updateData = response as unknown as { note: LoveNote }
      setNotes(notes.map(note => 
        note._id === id ? updateData.note : note
      ))
      
      toast({
        title: "Note updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error('Error updating love note:', error)
      toast({
        title: "Error updating note",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteNote = async (id: string) => {
    try {
      await api.deleteLoveNote(id)
      
      setNotes(notes.filter(note => note._id !== id))
      
      toast({
        title: "Note deleted",
        description: "Your note has been removed",
      })
    } catch (error) {
      console.error('Error deleting love note:', error)
      toast({
        title: "Error deleting note",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

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
          {/* New Note Card */}
          <NewEntryCard 
            onSubmit={handleCreateNote}
            title="Write a Love Note"
            includeContent={true}
            includeImage={false}
            buttonText="Send Note"
          />
          
          {/* Love Notes */}
          {isLoading ? (
            <div className="col-span-3 text-center py-10">
              <div className="animate-pulse">Loading love notes...</div>
            </div>
          ) : notes.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-muted-foreground">No love notes yet. Write the first one!</p>
            </div>
          ) : (
            notes.map((note) => (
              <InteractiveCard 
                key={note._id} 
                rotation={Math.random() > 0.5 ? "2deg" : "-2deg"}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <EditableContent
                        type="title"
                        value={note.title || "Love Note"}
                        onSave={(newValue) => handleUpdateNote(note._id, { title: String(newValue) })}
                        className="flex items-center gap-2 text-xl font-headline text-foreground"
                      />
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleUpdateNote(note._id, { isRead: !note.isRead })}
                      >
                        <Heart className={`h-4 w-4 ${note.isRead ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                      <DeleteButton onDelete={() => handleDeleteNote(note._id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <EditableContent
                      type="textarea"
                      value={note.content}
                      onSave={(newValue) => handleUpdateNote(note._id, { content: String(newValue) })}
                      className="italic leading-relaxed text-muted-foreground font-body"
                    />
                  </div>
                </CardContent>
              </InteractiveCard>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

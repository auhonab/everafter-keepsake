"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/common/Header"
import EditableCard from "@/components/ui/editable-card"
import NewEntryCard from "@/components/ui/new-entry-card"
import { api } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"

interface JournalEntry {
  _id: string
  title: string
  content: string
  date: string
  mood?: 'happy' | 'excited' | 'grateful' | 'romantic' | 'nostalgic' | 'peaceful' | 'other'
  tags?: string[]
}

export default function OurJournal() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  
  // Get the prompt from URL params
  const promptFromUrl = searchParams.get('prompt')
  
  const loadJournalEntries = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.getJournalEntries()
      setJournalEntries((response as unknown as JournalEntry[]) || [])
    } catch (error) {
      console.error('Error loading journal entries:', error)
      toast({
        title: "Error loading journal entries",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Load journal entries on component mount
  useEffect(() => {
    loadJournalEntries()
  }, [loadJournalEntries])
  
  const handleCreateEntry = async (data: { title: string; content?: string }) => {
    try {
      const response = await api.createJournalEntry({
        title: data.title,
        content: data.content || "",
        date: new Date().toISOString(),
      })
      
      setJournalEntries([(response as unknown as JournalEntry), ...journalEntries])
      
      toast({
        title: "Entry created",
        description: "Your journal entry has been added",
      })
    } catch (error) {
      console.error('Error creating journal entry:', error)
      toast({
        title: "Error creating entry",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleUpdateEntry = async (id: string, data: Partial<JournalEntry>) => {
    try {
      const response = await api.updateJournalEntry(id, data)
      
      setJournalEntries(journalEntries.map(entry => 
        entry._id === id ? (response as unknown as JournalEntry) : entry
      ))
      
      toast({
        title: "Entry updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error('Error updating journal entry:', error)
      toast({
        title: "Error updating entry",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteEntry = async (id: string) => {
    try {
      await api.deleteJournalEntry(id)
      
      setJournalEntries(journalEntries.filter(entry => entry._id !== id))
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed",
      })
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      toast({
        title: "Error deleting entry",
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
            Our Journal
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Reflections on our journey, moments of growth, and heartfelt words.
          </p>
        </div>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* New Entry Card */}
          <NewEntryCard 
            onSubmit={handleCreateEntry}
            title="Create New Journal Entry"
            includeContent={true}
            includeImage={false}
            buttonText="Add Entry"
            initialContent={promptFromUrl ? `Reflecting on: "${promptFromUrl}"\n\n` : ''}
          />

          {/* Journal Entries */}
          {isLoading ? (
            <div className="col-span-3 text-center py-10">
              <div className="animate-pulse">Loading journal entries...</div>
            </div>
          ) : journalEntries.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-muted-foreground">No journal entries yet. Create your first one!</p>
            </div>
          ) : (
            journalEntries.map((entry) => (
              <EditableCard
                key={entry._id}
                id={entry._id}
                title={entry.title}
                content={entry.content}
                date={entry.date}
                onUpdate={handleUpdateEntry}
                onDelete={handleDeleteEntry}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

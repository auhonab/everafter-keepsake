"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/common/Header"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { api } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"
import { Plus, Calendar, Loader2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DeleteButton from "@/components/ui/delete-button"

interface Countdown {
  _id: string
  title: string
  date: string
  description?: string
  userId: string
}

export default function Countdowns() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCountdown, setEditingCountdown] = useState<Countdown | null>(null)
  const [newCountdown, setNewCountdown] = useState({
    title: "",
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // Default 1 week from now
    description: ""
  })

  const { toast } = useToast()
  
  const loadCountdowns = useCallback(async () => {
    try {
      setIsLoading(true)
      // Get milestones but filter for countdowns only
      const response = await api.getMilestones()
      const fetchedMilestones = (response as Record<string, unknown>).milestones as Countdown[] || []
      
      // Filter for countdown type milestones only (identified by title prefix)
      const countdownMilestones = fetchedMilestones.filter((milestone: Countdown) => 
        milestone.title && milestone.title.startsWith('[COUNTDOWN]')
      )
      
      // Sort by closest date first
      const sortedCountdowns = [...countdownMilestones].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
      
      setCountdowns(sortedCountdowns)
    } catch (error) {
      console.error('Error loading countdowns:', error)
      toast({
        title: "Error loading countdowns",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])
  
  useEffect(() => {
    loadCountdowns()
  }, [loadCountdowns])
  
  const handleCreateCountdown = async () => {
    try {
      setIsSaving(true)
      console.log('Creating countdown with data:', {
        title: newCountdown.title,
        description: newCountdown.description,
        date: newCountdown.date,
        type: 'countdown',
        isRecurring: false
      });
      
      // Create a milestone with a special type to distinguish countdowns
      const response = await api.createMilestone({
        title: `[COUNTDOWN] ${newCountdown.title}`, // Add prefix to distinguish countdowns
        description: newCountdown.description,
        date: newCountdown.date,
        type: 'custom', // Use custom type but with special title prefix
        isRecurring: false
      })
      
      console.log('Countdown creation response:', response);
      
      const createdCountdown = (response as Record<string, unknown>).milestone as Countdown
      
      if (!createdCountdown) {
        throw new Error('No milestone returned from API');
      }
      
      // Add the new countdown and re-sort
      const updatedCountdowns = [...countdowns, createdCountdown].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      setCountdowns(updatedCountdowns)
      setOpenDialog(false)
      
      // Reset form
      setNewCountdown({
        title: "",
        date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
        description: ""
      })
      
      toast({
        title: "Countdown added",
        description: "Your countdown has been created",
      })
    } catch (error) {
      console.error('Error creating countdown:', error)
      toast({
        title: "Error adding countdown",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleUpdateCountdown = async (id: string, data: Record<string, unknown>) => {
    try {
      // Use the milestones API for now
      const response = await api.updateMilestone(id, data)
      
      setCountdowns(countdowns.map(countdown => 
        countdown._id === id ? (response as Record<string, unknown>).milestone as Countdown : countdown
      ))
      
      toast({
        title: "Countdown updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error('Error updating countdown:', error)
      toast({
        title: "Error updating countdown",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteCountdown = async (id: string) => {
    try {
      // Use the milestones API for now
      await api.deleteMilestone(id)
      
      setCountdowns(countdowns.filter(countdown => countdown._id !== id))
      
      toast({
        title: "Countdown deleted",
        description: "Your countdown has been removed",
      })
    } catch (error) {
      console.error('Error deleting countdown:', error)
      toast({
        title: "Error deleting countdown",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }
  
  const openEditDialog = (countdown: Countdown) => {
    setEditingCountdown(countdown)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Looking Forward To...
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Counting down the moments until our next special day.
          </p>
        </div>

        {/* Add Countdown Button */}
        <div className="flex justify-center mb-12">
          <Button 
            onClick={() => setOpenDialog(true)}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add Countdown
          </Button>
        </div>

        {/* Countdowns Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
            <span>Loading your countdowns...</span>
          </div>
        ) : countdowns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-6">No countdowns yet. Add your first countdown to something you&apos;re looking forward to!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {countdowns.map((countdown) => (
              <div key={countdown._id} className="relative group">
                <CountdownTimer
                  title={countdown.title.replace('[COUNTDOWN] ', '')}
                  date={countdown.date}
                />
                
                {/* Edit/Delete Buttons */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/80"
                    onClick={() => openEditDialog(countdown)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DeleteButton
                    onDelete={async () => await handleDeleteCountdown(countdown._id)}
                    size="icon"
                    className="h-8 w-8 bg-background/80"
                  />
                </div>
                
                {/* Description (if any) */}
                {countdown.description && (
                  <Card className="mt-2">
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">{countdown.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Add Countdown Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Countdown</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="countdownTitle" className="text-sm font-medium">Title</label>
              <Input 
                id="countdownTitle" 
                value={newCountdown.title} 
                onChange={(e) => setNewCountdown({...newCountdown, title: e.target.value})}
                placeholder="Enter a title for this countdown"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="countdownDate" className="text-sm font-medium">Date</label>
              <Input 
                id="countdownDate" 
                type="date" 
                value={newCountdown.date} 
                onChange={(e) => setNewCountdown({...newCountdown, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="countdownDescription" className="text-sm font-medium">Description (optional)</label>
              <Input 
                id="countdownDescription" 
                value={newCountdown.description} 
                onChange={(e) => setNewCountdown({...newCountdown, description: e.target.value})}
                placeholder="Add details about this countdown"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCountdown} 
              disabled={isSaving || !newCountdown.title.trim() || !newCountdown.date}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Countdown'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Countdown Dialog */}
      <Dialog open={!!editingCountdown} onOpenChange={(open: boolean) => !open && setEditingCountdown(null)}>
        {editingCountdown && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Countdown</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="editTitle" className="text-sm font-medium">Title</label>
                <Input 
                  id="editTitle" 
                  value={editingCountdown.title.replace('[COUNTDOWN] ', '')} 
                  onChange={(e) => setEditingCountdown({
                    ...editingCountdown, 
                    title: `[COUNTDOWN] ${e.target.value}`
                  })}
                  placeholder="Enter a title for this countdown"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="editDate" className="text-sm font-medium">Date</label>
                <Input 
                  id="editDate" 
                  type="date" 
                  value={new Date(editingCountdown.date).toISOString().split('T')[0]} 
                  onChange={(e) => setEditingCountdown({...editingCountdown, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="editDescription" className="text-sm font-medium">Description (optional)</label>
                <Input 
                  id="editDescription" 
                  value={editingCountdown.description || ""} 
                  onChange={(e) => setEditingCountdown({...editingCountdown, description: e.target.value})}
                  placeholder="Add details about this countdown"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingCountdown(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  handleUpdateCountdown(editingCountdown._id, {
                    title: editingCountdown.title,
                    date: editingCountdown.date,
                    description: editingCountdown.description
                  })
                  setEditingCountdown(null)
                }} 
                disabled={!editingCountdown.title.replace('[COUNTDOWN] ', '').trim() || !editingCountdown.date}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

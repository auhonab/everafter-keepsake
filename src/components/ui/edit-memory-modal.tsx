"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Card, CardContent } from './card'
import { Label } from './label'
import LocationSelector from './location-selector'
import ImageUpload from './image-upload'
import { Calendar, MapPin, Image as ImageIcon, Tag, Save, Loader2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/hooks/useApi'
import Image from 'next/image'

interface LocationData {
  lat: number
  lng: number
  name: string
}

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

interface EditMemoryModalProps {
  memory: Memory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemoryUpdated?: (memory: Memory) => void
}

export default function EditMemoryModal({
  memory,
  open,
  onOpenChange,
  onMemoryUpdated
}: EditMemoryModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    images: [] as string[],
    tags: [] as string[],
    location: null as LocationData | null
  })
  const [newTag, setNewTag] = useState('')
  const { toast } = useToast()

  // Initialize form data when memory changes
  useEffect(() => {
    if (memory) {
      setFormData({
        title: memory.title || '',
        description: memory.description || '',
        date: memory.date ? new Date(memory.date).toISOString().split('T')[0] : '',
        images: memory.images || [],
        tags: memory.tags || [],
        location: memory.coordinates ? {
          lat: memory.coordinates.lat,
          lng: memory.coordinates.lng,
          name: memory.locationName || memory.location || ''
        } : null
      })
    }
  }, [memory])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }))
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for your memory",
        variant: "destructive",
      })
      return false
    }

    if (!formData.date) {
      toast({
        title: "Validation Error",
        description: "Please select a date for your memory",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!memory || !validateForm()) return

    setIsUpdating(true)
    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date),
        images: formData.images,
        tags: formData.tags,
        ...(formData.location && {
          location: formData.location.name,
          coordinates: {
            lat: formData.location.lat,
            lng: formData.location.lng
          },
          locationName: formData.location.name
        })
      }

      const response = await api.updateMemory(memory._id, updateData)
      const updatedMemory = (response as any).memory

      toast({
        title: "Memory updated successfully!",
        description: "Your changes have been saved",
      })

      // Close modal
      onOpenChange(false)

      // Notify parent component
      onMemoryUpdated?.(updatedMemory)

    } catch (error) {
      console.error('Error updating memory:', error)
      toast({
        title: "Error updating memory",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const resetForm = () => {
    if (memory) {
      setFormData({
        title: memory.title || '',
        description: memory.description || '',
        date: memory.date ? new Date(memory.date).toISOString().split('T')[0] : '',
        images: memory.images || [],
        tags: memory.tags || [],
        location: memory.coordinates ? {
          lat: memory.coordinates.lat,
          lng: memory.coordinates.lng,
          name: memory.locationName || memory.location || ''
        } : null
      })
    }
    setNewTag('')
  }

  if (!memory) return null

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) resetForm()
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Edit Memory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Give your memory a meaningful title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this memory in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Location */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <LocationSelector
              value={formData.location}
              onLocationSelect={(location) => handleInputChange('location', location)}
              placeholder="Search for the location of this memory..."
            />
          </div>

          {/* Images */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </Label>
            
            {/* Show uploaded images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={image}
                      alt={`Memory image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Image upload */}
            <ImageUpload
              onImageUploaded={handleImageUpload}
              caption="Add Image"
            />
          </div>

          {/* Tags */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary/70 hover:text-primary ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="space-y-2 text-sm">
                {formData.title && (
                  <div>
                    <strong>Title:</strong> {formData.title}
                  </div>
                )}
                {formData.date && (
                  <div>
                    <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
                  </div>
                )}
                {formData.location && (
                  <div>
                    <strong>Location:</strong> {formData.location.name}
                  </div>
                )}
                {formData.description && (
                  <div>
                    <strong>Description:</strong> {formData.description.slice(0, 100)}{formData.description.length > 100 ? '...' : ''}
                  </div>
                )}
                {formData.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong> {formData.tags.join(', ')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || !formData.title.trim()}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

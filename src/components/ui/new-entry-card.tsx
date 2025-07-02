import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'

interface NewEntryCardProps {
  onSubmit: (data: {
    title: string
    content?: string
    image?: string
    [key: string]: any
  }) => Promise<void>
  className?: string
  title?: string
  includeContent?: boolean
  includeImage?: boolean
  additionalFields?: React.ReactNode
  buttonText?: string
  layout?: 'vertical' | 'horizontal'
}

/**
 * A card component for creating new entries (memories, journal entries, etc.)
 * 
 * @param props NewEntryCardProps
 * @returns React Component
 */
export default function NewEntryCard({
  onSubmit,
  className = '',
  title = 'Create New',
  includeContent = true,
  includeImage = false,
  additionalFields,
  buttonText = 'Create',
  layout = 'vertical'
}: NewEntryCardProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  })
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      // Title is required
      return
    }
    
    try {
      setIsSubmitting(true)
      await onSubmit(formData)
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        image: '',
      })
      
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating new entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isCreating) {
    return (
      <Card className={`cursor-pointer hover:bg-accent/50 transition-colors ${className}`}>
        <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[200px]">
          <Button
            variant="ghost"
            onClick={() => setIsCreating(true)}
            className="h-full w-full flex flex-col gap-2"
          >
            <PlusCircle className="h-12 w-12" />
            <span className="font-medium">{title}</span>
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={`shadow-md ${className}`}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {layout === 'horizontal' && includeImage ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title..."
                    required
                  />
                </div>
                
                {includeContent && (
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter description..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                )}
                
                {additionalFields}
              </div>
              
              {/* Right Column - Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    defaultImage={formData.image}
                    height={180}
                    width={300}
                    caption="Add Cover"
                    editMode={true}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title..."
                  required
                />
              </div>
              
              {includeContent && (
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter content..."
                    rows={4}
                  />
                </div>
              )}
              
              {includeImage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    defaultImage={formData.image}
                    height={200}
                    width={400}
                    caption="Add Image"
                    editMode={true}
                  />
                </div>
              )}
              
              {additionalFields}
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreating(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
            {isSubmitting ? 'Saving...' : buttonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

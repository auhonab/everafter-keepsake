import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, MoreVertical, Calendar } from 'lucide-react'
import EditableContent from '@/components/ui/editable-content'
import DeleteButton from '@/components/ui/delete-button'
import ImageUpload from '@/components/ui/image-upload'
import { formatDate } from '@/lib/utils'

interface EditableCardProps {
  id: string
  title: string
  content?: string
  date?: Date | string
  image?: string
  onUpdate: (id: string, data: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onImageUpdate?: (id: string, imageUrl: string) => Promise<void>
  className?: string
  footerContent?: React.ReactNode
  showDate?: boolean
  imageHeight?: number
}

/**
 * A card component with editable title, content, and image
 * 
 * @param props EditableCardProps
 * @returns React Component
 */
export default function EditableCard({
  id,
  title,
  content,
  date,
  image,
  onUpdate,
  onDelete,
  onImageUpdate,
  className = '',
  footerContent,
  showDate = true,
  imageHeight = 200
}: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const handleTitleUpdate = async (newValue: string | number) => {
    await onUpdate(id, { title: String(newValue) })
  }
  
  const handleContentUpdate = async (newValue: string | number) => {
    await onUpdate(id, { content: String(newValue) })
  }
  
  const handleDelete = async () => {
    await onDelete(id)
  }
  
  const handleImageUploaded = async (url: string) => {
    if (onImageUpdate) {
      await onImageUpdate(id, url)
    } else {
      await onUpdate(id, { image: url })
    }
  }
  
  return (
    <Card className={`overflow-hidden shadow-md transition-all hover:shadow-lg ${className}`}>
      {image && (
        <div className="relative" style={{ height: `${imageHeight}px` }}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          {onImageUpdate && (
            <div className="absolute bottom-2 right-2">
              <ImageUpload
                defaultImage={image}
                onImageUploaded={handleImageUploaded}
                height={imageHeight}
                width={400}
                caption="Replace Image"
              />
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <EditableContent
            type="title"
            value={title}
            onSave={handleTitleUpdate}
            className="card-title"
            placeholder="Enter title..."
          />
          {showDate && date && (
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="mr-1 h-3 w-3" />
              <time dateTime={new Date(date).toISOString()}>
                {formatDate(new Date(date))}
              </time>
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteButton onDelete={handleDelete} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        {content && (
          <EditableContent
            type="textarea"
            value={content}
            onSave={handleContentUpdate}
            className="text-sm text-muted-foreground"
            placeholder="Enter content..."
          />
        )}
        
        {!image && onImageUpdate && (
          <div className="mt-4">
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              height={imageHeight}
              width={400}
              caption="Add Image"
            />
          </div>
        )}
      </CardContent>
      
      {footerContent && (
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  )
}

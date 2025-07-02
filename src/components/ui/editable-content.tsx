import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface EditableContentProps {
  type: 'text' | 'textarea' | 'title' | 'number'
  value: string | number
  onSave: (newValue: string | number) => Promise<void> | void
  className?: string
  disabled?: boolean
  placeholder?: string
  maxLength?: number
}

/**
 * EditableContent component allows inline editing of text content
 * 
 * @param props EditableContentProps
 * @returns React Component
 */
export default function EditableContent({
  type = 'text',
  value,
  onSave,
  className = '',
  disabled = false,
  placeholder = 'Click to edit',
  maxLength,
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState<string | number>(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  
  // Update local state if the value prop changes
  useEffect(() => {
    setEditValue(value)
  }, [value])
  
  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleEdit = () => {
    if (!disabled) {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving content:', error)
      // Reset to original value on error
      setEditValue(value)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Determine content element based on type
  const renderDisplayContent = () => {
    switch (type) {
      case 'title':
        return <h3 className={`font-semibold cursor-pointer text-lg ${className}`} onClick={handleEdit}>{value || placeholder}</h3>
      case 'textarea':
        return <p className={`whitespace-pre-wrap cursor-pointer ${className}`} onClick={handleEdit}>{value || placeholder}</p>
      case 'number':
        return <span className={`cursor-pointer ${className}`} onClick={handleEdit}>{value || placeholder}</span>
      default:
        return <span className={`cursor-pointer ${className}`} onClick={handleEdit}>{value || placeholder}</span>
    }
  }

  // Determine input element based on type
  const renderEditInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea 
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue as string}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={className}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )
      case 'number':
        return (
          <Input 
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            value={editValue as number}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditValue(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            className={className}
            placeholder={placeholder}
          />
        )
      default:
        return (
          <Input 
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={className}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )
    }
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          {renderEditInput()}
          <div className="flex justify-end gap-2 mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        renderDisplayContent()
      )}
    </div>
  )
}

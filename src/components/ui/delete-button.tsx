import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  confirmText?: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  disabled?: boolean
}

/**
 * A button component that requires confirmation before deletion
 * 
 * @param props DeleteButtonProps
 * @returns React Component
 */
export default function DeleteButton({
  onDelete,
  confirmText = 'Are you sure?',
  className = '',
  size = 'default',
  variant = 'ghost',
  disabled = false,
}: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleClick = async () => {
    if (isConfirming) {
      try {
        setIsDeleting(true)
        await onDelete()
      } catch (error) {
        console.error('Error during delete:', error)
      } finally {
        setIsConfirming(false)
        setIsDeleting(false)
      }
    } else {
      setIsConfirming(true)
      
      // Reset after 3 seconds if not confirmed
      setTimeout(() => {
        setIsConfirming(false)
      }, 3000)
    }
  }
  
  return (
    <Button
      onClick={handleClick}
      variant={isConfirming ? 'destructive' : variant}
      size={size}
      className={className}
      disabled={disabled || isDeleting}
    >
      {isDeleting ? (
        'Deleting...'
      ) : isConfirming ? (
        confirmText
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}

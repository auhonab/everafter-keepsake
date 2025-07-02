import { useState, useRef, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  className?: string
  defaultImage?: string
  maxSizeMB?: number
  height?: number
  width?: number
  caption?: string
  editMode?: boolean
}

/**
 * Image upload component that uploads directly to Cloudinary
 * 
 * @param props ImageUploadProps
 * @returns React Component
 */
export default function ImageUpload({
  onImageUploaded,
  className = '',
  defaultImage = '',
  maxSizeMB = 5,
  height = 300,
  width = 500,
  caption = 'Upload Image',
  editMode = false,
}: ImageUploadProps) {
  const [image, setImage] = useState<string>(defaultImage)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024 // MB to bytes
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return
    }
    
    try {
      setUploading(true)
      setError(null)
      
      // Check if Cloudinary is configured
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      
      if (!uploadPreset || !cloudName) {
        // Mock upload for development - create a temporary object URL
        const mockUrl = URL.createObjectURL(file)
        console.warn('Cloudinary not configured, using mock URL:', mockUrl)
        setImage(mockUrl)
        onImageUploaded(mockUrl)
        return
      }
      
      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json()
      
      if (!data.secure_url) {
        throw new Error('Invalid response from Cloudinary (missing secure_url)')
      }
      
      // Set the image URL and notify parent
      setImage(data.secure_url)
      onImageUploaded(data.secure_url)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }
  
  const handleRemoveImage = () => {
    setImage('')
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      
      {image ? (
        <div className="relative">
          <Image
            src={image}
            alt="Uploaded"
            height={height}
            width={width}
            className="object-cover rounded-md"
          />
          {editMode && (
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={handleRemoveImage}
                className="bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full transition-colors"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        editMode ? (
          <div
            onClick={handleImageClick}
            className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 
                       rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors
                       h-[${height}px] w-[${width}px] p-4`}
          >
            {uploading ? (
              <div className="text-center">
                <div className="animate-pulse">Uploading...</div>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">{caption}</p>
                <p className="text-xs text-gray-400 mt-1">Click to browse</p>
              </>
            )}
          </div>
        ) : (
          <div className={`h-[${height}px] w-[${width}px] bg-gray-100 rounded-md flex items-center justify-center`}>
            <ImageIcon className="h-12 w-12 text-gray-300" />
          </div>
        )
      )}
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      {!image && editMode && (
        <Button 
          onClick={handleImageClick}
          variant="outline" 
          size="sm" 
          className="mt-2"
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      )}
    </div>
  )
}

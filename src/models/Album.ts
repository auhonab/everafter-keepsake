import mongoose from 'mongoose'

export interface IAlbum extends mongoose.Document {
  title: string
  description?: string
  coverImage?: string
  memories: mongoose.Types.ObjectId[]
  userId: mongoose.Types.ObjectId
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}

const AlbumSchema = new mongoose.Schema<IAlbum>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  memories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory',
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Index for better query performance
AlbumSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema)

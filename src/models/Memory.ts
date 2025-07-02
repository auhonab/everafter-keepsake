import mongoose from 'mongoose'

export interface IMemory extends mongoose.Document {
  title: string
  description?: string
  date: Date
  images: string[]
  location?: string
  tags: string[]
  userId: mongoose.Types.ObjectId
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}

const MemorySchema = new mongoose.Schema<IMemory>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  images: [{
    type: String,
  }],
  location: {
    type: String,
  },
  tags: [{
    type: String,
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
MemorySchema.index({ userId: 1, date: -1 })
MemorySchema.index({ tags: 1 })

export default mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema)

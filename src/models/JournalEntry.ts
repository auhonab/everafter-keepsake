import mongoose from 'mongoose'

export interface IJournalEntry extends mongoose.Document {
  title: string
  content: string
  mood?: 'happy' | 'excited' | 'grateful' | 'romantic' | 'nostalgic' | 'peaceful' | 'other'
  date: Date
  userId: mongoose.Types.ObjectId
  isPrivate: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const JournalEntrySchema = new mongoose.Schema<IJournalEntry>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'excited', 'grateful', 'romantic', 'nostalgic', 'peaceful', 'other'],
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
})

// Index for better query performance
JournalEntrySchema.index({ userId: 1, date: -1 })
JournalEntrySchema.index({ tags: 1 })

export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema)

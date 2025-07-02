import mongoose from 'mongoose'

export interface ILoveNote extends mongoose.Document {
  title?: string
  content: string
  recipient: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  isRead: boolean
  scheduledFor?: Date
  style?: 'romantic' | 'playful' | 'grateful' | 'supportive' | 'funny'
  createdAt: Date
  updatedAt: Date
}

const LoveNoteSchema = new mongoose.Schema<ILoveNote>({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  scheduledFor: {
    type: Date,
  },
  style: {
    type: String,
    enum: ['romantic', 'playful', 'grateful', 'supportive', 'funny'],
    default: 'romantic',
  },
}, {
  timestamps: true,
})

// Index for better query performance
LoveNoteSchema.index({ recipient: 1, createdAt: -1 })
LoveNoteSchema.index({ sender: 1, createdAt: -1 })
LoveNoteSchema.index({ scheduledFor: 1 })

export default mongoose.models.LoveNote || mongoose.model<ILoveNote>('LoveNote', LoveNoteSchema)

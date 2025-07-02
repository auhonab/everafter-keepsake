import mongoose from 'mongoose'

export interface IMilestone extends mongoose.Document {
  title: string
  description?: string
  date: Date
  type: 'anniversary' | 'first_date' | 'engagement' | 'wedding' | 'birthday' | 'custom'
  image?: string
  location?: string
  userId: mongoose.Types.ObjectId
  isRecurring: boolean
  createdAt: Date
  updatedAt: Date
}

const MilestoneSchema = new mongoose.Schema<IMilestone>({
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
  type: {
    type: String,
    enum: ['anniversary', 'first_date', 'engagement', 'wedding', 'birthday', 'custom'],
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Index for better query performance
MilestoneSchema.index({ userId: 1, date: 1 })
MilestoneSchema.index({ type: 1 })

export default mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema)

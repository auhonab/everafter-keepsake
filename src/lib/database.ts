import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

/**
 * Get or create a user from Clerk user data
 */
export async function getOrCreateUser(clerkUserId: string, userData?: {
  email?: string
  firstName?: string
  lastName?: string
  profileImage?: string
}) {
  await dbConnect()
  
  let user = await User.findOne({ clerkId: clerkUserId })
  
  if (!user && userData) {
    user = new User({
      clerkId: clerkUserId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImage: userData.profileImage,
    })
    await user.save()
  }
  
  return user
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  await dbConnect()
  return await User.findOne({ clerkId }).populate('partner', 'firstName lastName email profileImage')
}

/**
 * Update user partner relationship
 */
export async function linkPartners(userId1: string, userId2: string) {
  await dbConnect()
  
  const user1 = await User.findById(userId1)
  const user2 = await User.findById(userId2)
  
  if (!user1 || !user2) {
    throw new Error('One or both users not found')
  }
  
  user1.partner = user2._id
  user2.partner = user1._id
  
  await Promise.all([user1.save(), user2.save()])
  
  return { user1, user2 }
}

/**
 * Get upcoming milestones for a user
 */
export async function getUpcomingMilestones(userId: string, days: number = 30) {
  await dbConnect()
  
  const { Milestone } = await import('@/models')
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)
  
  return await Milestone.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 })
}

/**
 * Get recent memories for a user
 */
export async function getRecentMemories(userId: string, limit: number = 5) {
  await dbConnect()
  
  const { Memory } = await import('@/models')
  
  return await Memory.find({ userId })
    .sort({ date: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName')
}

/**
 * Get unread love notes for a user
 */
export async function getUnreadLoveNotes(userId: string) {
  await dbConnect()
  
  const { LoveNote } = await import('@/models')
  
  return await LoveNote.find({
    recipient: userId,
    isRead: false
  })
    .sort({ createdAt: -1 })
    .populate('sender', 'firstName lastName profileImage')
}

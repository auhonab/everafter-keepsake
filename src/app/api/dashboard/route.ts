import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { User, Memory, Album, JournalEntry, LoveNote, Milestone } from '@/models'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId }).populate('partner', 'firstName lastName profileImage')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get counts
    const [
      memoriesCount,
      albumsCount,
      journalEntriesCount,
      loveNotesReceived,
      upcomingMilestones,
      recentMemories,
      unreadLoveNotes,
    ] = await Promise.all([
      Memory.countDocuments({ userId: user._id }),
      Album.countDocuments({ userId: user._id }),
      JournalEntry.countDocuments({ userId: user._id }),
      LoveNote.countDocuments({ recipient: user._id }),
      Milestone.find({
        userId: user._id,
        date: { $gte: new Date() }
      }).sort({ date: 1 }).limit(3),
      Memory.find({ userId: user._id })
        .sort({ date: -1 })
        .limit(5)
        .select('title date images'),
      LoveNote.find({
        recipient: user._id,
        isRead: false
      }).sort({ createdAt: -1 }).limit(5)
        .populate('sender', 'firstName lastName profileImage'),
    ])

    // Calculate relationship stats if user has a partner
    let relationshipStats = null
    if (user.partner) {
      const partnerUser = await User.findById(user.partner._id)
      if (partnerUser) {
        const sharedMemories = await Memory.countDocuments({
          $or: [
            { userId: user._id },
            { userId: partnerUser._id }
          ]
        })

        const totalLoveNotes = await LoveNote.countDocuments({
          $or: [
            { sender: user._id, recipient: partnerUser._id },
            { sender: partnerUser._id, recipient: user._id }
          ]
        })

        relationshipStats = {
          sharedMemories,
          totalLoveNotes,
          partner: user.partner
        }
      }
    }

    const dashboardData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        partner: user.partner
      },
      stats: {
        memories: memoriesCount,
        albums: albumsCount,
        journalEntries: journalEntriesCount,
        loveNotesReceived,
      },
      upcomingMilestones,
      recentMemories,
      unreadLoveNotes,
      relationshipStats,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

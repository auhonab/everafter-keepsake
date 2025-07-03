import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { LoveNote, User } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'sent' or 'received'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build query based on type
    let query: Record<string, unknown> | { $or: Array<Record<string, unknown>> } = {}
    if (type === 'sent') {
      query.sender = user._id
    } else if (type === 'received') {
      query.recipient = user._id
    } else {
      // Get both sent and received
      query = {
        $or: [
          { sender: user._id },
          { recipient: user._id }
        ]
      }
    }

    const notes = await LoveNote.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'firstName lastName profileImage')
      .populate('recipient', 'firstName lastName profileImage')

    const total = await LoveNote.countDocuments(query)

    return NextResponse.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching love notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, recipient, scheduledFor, style } = body

    if (!content || !recipient) {
      return NextResponse.json({ error: 'Content and recipient are required' }, { status: 400 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Handle special case for self-notes (demo)
    let recipientUser = user;
    if (recipient !== "self") {
      recipientUser = await User.findById(recipient)
      if (!recipientUser) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
      }
    }

    const note = new LoveNote({
      title,
      content,
      sender: user._id,
      recipient: recipientUser._id,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      style: style || 'romantic',
    })

    await note.save()
    await note.populate([
      { path: 'sender', select: 'firstName lastName profileImage' },
      { path: 'recipient', select: 'firstName lastName profileImage' }
    ])

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error('Error creating love note:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

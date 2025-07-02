import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { LoveNote, User } from '@/models'
import mongoose from 'mongoose'

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET a specific love note by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid love note ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the note and make sure it belongs to this user (either as sender or recipient)
    const note = await LoveNote.findOne({
      _id: id,
      $or: [
        { sender: user._id },
        { recipient: user._id }
      ]
    })
    .populate('sender', 'firstName lastName profileImage')
    .populate('recipient', 'firstName lastName profileImage')
    
    if (!note) {
      return NextResponse.json({ error: 'Love note not found' }, { status: 404 })
    }
    
    // If this user is the recipient and it's unread, mark it as read
    if (note.recipient._id.toString() === user._id.toString() && !note.isRead) {
      note.isRead = true
      await note.save()
    }
    
    return NextResponse.json({ note })
  } catch (error) {
    console.error('Error fetching love note:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH to update a love note
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid love note ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, scheduledFor, style, isRead } = body
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the note and make sure it belongs to this user (as sender)
    const note = await LoveNote.findOne({
      _id: id,
      sender: user._id
    })
    
    if (!note) {
      return NextResponse.json({ error: 'Love note not found or you do not have permission to edit it' }, { status: 404 })
    }
    
    // Update fields if provided
    if (title !== undefined) note.title = title
    if (content !== undefined) note.content = content
    if (scheduledFor !== undefined) note.scheduledFor = scheduledFor ? new Date(scheduledFor) : undefined
    if (style !== undefined) note.style = style
    
    // Only the recipient can mark as read/unread
    if (isRead !== undefined && note.recipient.toString() === user._id.toString()) {
      note.isRead = isRead
    }
    
    await note.save()
    await note.populate([
      { path: 'sender', select: 'firstName lastName profileImage' },
      { path: 'recipient', select: 'firstName lastName profileImage' }
    ])
    
    return NextResponse.json({ note })
  } catch (error) {
    console.error('Error updating love note:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE a love note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid love note ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the note and make sure it belongs to this user (either as sender or recipient)
    const note = await LoveNote.findOne({
      _id: id,
      $or: [
        { sender: user._id },
        { recipient: user._id }
      ]
    })
    
    if (!note) {
      return NextResponse.json({ error: 'Love note not found' }, { status: 404 })
    }
    
    await note.deleteOne()
    
    return NextResponse.json({ message: 'Love note deleted successfully' })
  } catch (error) {
    console.error('Error deleting love note:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

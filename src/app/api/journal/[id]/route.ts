import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { JournalEntry, User } from '@/models'
import mongoose from 'mongoose'

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET a specific journal entry by ID
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
      return NextResponse.json({ error: 'Invalid journal entry ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the entry and make sure it belongs to this user
    const entry = await JournalEntry.findOne({
      _id: id,
      userId: user._id
    }).populate('userId', 'firstName lastName')
    
    if (!entry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
    }
    
    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error fetching journal entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH to update a journal entry
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
      return NextResponse.json({ error: 'Invalid journal entry ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, mood, date, tags, isPrivate } = body
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the entry and make sure it belongs to this user
    const entry = await JournalEntry.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!entry) {
      return NextResponse.json({ error: 'Journal entry not found or you do not have permission to edit it' }, { status: 404 })
    }
    
    // Update fields if provided
    if (title !== undefined) entry.title = title
    if (content !== undefined) entry.content = content
    if (mood !== undefined) entry.mood = mood
    if (date !== undefined) entry.date = new Date(date)
    if (tags !== undefined) entry.tags = tags
    if (isPrivate !== undefined) entry.isPrivate = isPrivate
    
    await entry.save()
    await entry.populate('userId', 'firstName lastName')
    
    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE a journal entry
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
      return NextResponse.json({ error: 'Invalid journal entry ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the entry and make sure it belongs to this user
    const entry = await JournalEntry.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!entry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
    }
    
    await entry.deleteOne()
    
    return NextResponse.json({ message: 'Journal entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

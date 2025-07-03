import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Milestone, User } from '@/models'
import mongoose from 'mongoose'

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET a specific milestone by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid milestone ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the milestone and make sure it belongs to this user
    const milestone = await Milestone.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }
    
    return NextResponse.json({ milestone })
  } catch (error) {
    console.error('Error fetching milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH to update a milestone
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid milestone ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, date, type, location, isRecurring } = body
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the milestone and make sure it belongs to this user
    const milestone = await Milestone.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found or you do not have permission to edit it' }, { status: 404 })
    }
    
    // Update fields if provided
    if (title !== undefined) milestone.title = title
    if (description !== undefined) milestone.description = description
    if (date !== undefined) milestone.date = new Date(date)
    if (type !== undefined) milestone.type = type
    if (location !== undefined) milestone.location = location
    if (isRecurring !== undefined) milestone.isRecurring = isRecurring
    
    await milestone.save()
    
    return NextResponse.json({ milestone })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT to update a milestone (complete replacement)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid milestone ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, date, type, location, isRecurring } = body
    
    if (!title || !date || !type) {
      return NextResponse.json({ error: 'Title, date, and type are required fields' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the milestone and make sure it belongs to this user
    const milestone = await Milestone.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found or you do not have permission to edit it' }, { status: 404 })
    }
    
    // Update all fields
    milestone.title = title
    milestone.description = description || null
    milestone.date = new Date(date)
    milestone.type = type
    milestone.location = location || null
    milestone.isRecurring = isRecurring !== undefined ? isRecurring : false
    
    await milestone.save()
    
    return NextResponse.json({ milestone })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE a milestone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid milestone ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the milestone and make sure it belongs to this user
    const milestone = await Milestone.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }
    
    await milestone.deleteOne()
    
    return NextResponse.json({ message: 'Milestone deleted successfully' })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
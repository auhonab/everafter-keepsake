import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Memory, User } from '@/models'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const memory = await Memory.findOne({ _id: params.id, userId: user._id })
      .populate('userId', 'firstName lastName')

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }

    return NextResponse.json({ memory })
  } catch (error) {
    console.error('Error fetching memory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, images, location, tags, isPrivate } = body

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const memory = await Memory.findOne({ _id: params.id, userId: user._id })

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }

    // Update memory fields
    if (title !== undefined) memory.title = title
    if (description !== undefined) memory.description = description
    if (date !== undefined) memory.date = new Date(date)
    if (images !== undefined) memory.images = images
    if (location !== undefined) memory.location = location
    if (tags !== undefined) memory.tags = tags
    if (isPrivate !== undefined) memory.isPrivate = isPrivate

    await memory.save()
    await memory.populate('userId', 'firstName lastName')

    return NextResponse.json({ memory })
  } catch (error) {
    console.error('Error updating memory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const memory = await Memory.findOne({ _id: params.id, userId: user._id })

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }

    await Memory.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Memory deleted successfully' })
  } catch (error) {
    console.error('Error deleting memory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Album, User } from '@/models'
import mongoose from 'mongoose'
import { ensureUserExists } from '@/lib/ensureUser'

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET a specific album by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await ensureUserExists()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the album and make sure it belongs to this user
    const album = await Album.findOne({
      _id: id,
      userId: user._id
    })
    .populate('userId', 'firstName lastName')
    .populate('memories')
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }
    
    return NextResponse.json({ album })
  } catch (error) {
    console.error('Error fetching album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT to update an album
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, coverImage, memories, isPrivate } = body
    
    await dbConnect()
    
    const user = await ensureUserExists()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the album and make sure it belongs to this user
    const album = await Album.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found or you do not have permission to edit it' }, { status: 404 })
    }
    
    // Update fields if provided
    if (title !== undefined) album.title = title
    if (description !== undefined) album.description = description
    if (coverImage !== undefined) album.coverImage = coverImage
    if (memories !== undefined) album.memories = memories
    if (isPrivate !== undefined) album.isPrivate = isPrivate
    
    await album.save()
    await album.populate('userId', 'firstName lastName')
    await album.populate('memories')
    
    return NextResponse.json({ album })
  } catch (error) {
    console.error('Error updating album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH to update an album (similar to PUT but partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, coverImage, memories, isPrivate } = body
    
    await dbConnect()
    
    const user = await ensureUserExists()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the album and make sure it belongs to this user
    const album = await Album.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found or you do not have permission to edit it' }, { status: 404 })
    }
    
    // Update fields if provided
    if (title !== undefined) album.title = title
    if (description !== undefined) album.description = description
    if (coverImage !== undefined) album.coverImage = coverImage
    if (memories !== undefined) album.memories = memories
    if (isPrivate !== undefined) album.isPrivate = isPrivate
    
    await album.save()
    await album.populate('userId', 'firstName lastName')
    await album.populate('memories')
    
    return NextResponse.json({ album })
  } catch (error) {
    console.error('Error updating album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE an album
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 })
    }
    
    await dbConnect()
    
    const user = await ensureUserExists()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the album and make sure it belongs to this user
    const album = await Album.findOne({
      _id: id,
      userId: user._id
    })
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }
    
    await album.deleteOne()
    
    return NextResponse.json({ message: 'Album deleted successfully' })
  } catch (error) {
    console.error('Error deleting album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

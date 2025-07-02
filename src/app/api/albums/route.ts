import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Album, User } from '@/models'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const albums = await Album.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('memories', 'title date images')
      .populate('userId', 'firstName lastName')

    const total = await Album.countDocuments({ userId: user._id })

    return NextResponse.json({
      albums,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching albums:', error)
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
    const { title, description, coverImage, memories, isPrivate } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const album = new Album({
      title,
      description,
      coverImage,
      memories: memories || [],
      userId: user._id,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
    })

    await album.save()
    await album.populate([
      { path: 'memories', select: 'title date images' },
      { path: 'userId', select: 'firstName lastName' }
    ])

    return NextResponse.json({ album }, { status: 201 })
  } catch (error) {
    console.error('Error creating album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

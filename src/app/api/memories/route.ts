import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Memory, User } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    // Get user to verify they exist
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const skip = (page - 1) * limit

    // Build query
    let query: any = { userId: user._id }
    if (tag) {
      query.tags = { $in: [tag] }
    }

    const memories = await Memory.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName')

    const total = await Memory.countDocuments(query)

    return NextResponse.json({
      memories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching memories:', error)
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
    const { title, description, date, images, location, tags, isPrivate } = body

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 })
    }

    await dbConnect()
    
    // Get user to verify they exist
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const memory = new Memory({
      title,
      description,
      date: new Date(date),
      images: images || [],
      location,
      tags: tags || [],
      userId: user._id,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
    })

    await memory.save()
    await memory.populate('userId', 'firstName lastName')

    return NextResponse.json({ memory }, { status: 201 })
  } catch (error) {
    console.error('Error creating memory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

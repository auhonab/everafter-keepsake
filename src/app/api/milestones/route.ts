import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Milestone, User } from '@/models'

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
    const type = searchParams.get('type')
    const upcoming = searchParams.get('upcoming') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build query
    let query: any = { userId: user._id }
    if (type) {
      query.type = type
    }
    if (upcoming) {
      query.date = { $gte: new Date() }
    }

    const milestones = await Milestone.find(query)
      .sort({ date: upcoming ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName')

    const total = await Milestone.countDocuments(query)

    return NextResponse.json({
      milestones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching milestones:', error)
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
    const { title, description, date, type, image, location, isRecurring } = body

    if (!title || !date || !type) {
      return NextResponse.json({ error: 'Title, date, and type are required' }, { status: 400 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const milestone = new Milestone({
      title,
      description,
      date: new Date(date),
      type,
      image,
      location,
      userId: user._id,
      isRecurring: isRecurring || false,
    })

    await milestone.save()
    await milestone.populate('userId', 'firstName lastName')

    return NextResponse.json({ milestone }, { status: 201 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

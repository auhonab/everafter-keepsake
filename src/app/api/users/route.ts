import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId }).populate('partner', 'firstName lastName email profileImage')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
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
    const { email, firstName, lastName, profileImage } = body

    await dbConnect()
    
    // Check if user already exists
    let user = await User.findOne({ clerkId: userId })
    
    if (user) {
      // Update existing user
      user.email = email
      user.firstName = firstName
      user.lastName = lastName
      user.profileImage = profileImage
      await user.save()
    } else {
      // Create new user
      user = new User({
        clerkId: userId,
        email,
        firstName,
        lastName,
        profileImage,
      })
      await user.save()
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, profileImage, partnerId } = body

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (profileImage !== undefined) user.profileImage = profileImage
    if (partnerId !== undefined) user.partner = partnerId

    await user.save()

    const updatedUser = await User.findById(user._id).populate('partner', 'firstName lastName email profileImage')

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

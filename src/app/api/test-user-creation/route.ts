import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ensureUserExists } from '@/lib/ensureUser'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'
import mongoose from 'mongoose'

// This is a test endpoint to debug user creation issues
export async function GET(request: NextRequest) {
  try {
    // Get user from Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // First, let's check if we can connect to MongoDB
    try {
      await dbConnect()
      console.log('MongoDB connection successful')
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      return NextResponse.json({ 
        error: 'MongoDB connection failed', 
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 })
    }
    
    // Step 1: Check if user already exists directly
    let existingUser
    try {
      existingUser = await User.findOne({ clerkId: userId })
      console.log('Direct user lookup result:', existingUser ? 'Found' : 'Not found')
    } catch (findError) {
      console.error('Error finding user:', findError)
    }
    
    // Step 2: Try to create or get user using ensureUserExists
    let user
    try {
      console.log('Calling ensureUserExists...')
      user = await ensureUserExists()
      console.log('ensureUserExists result:', user ? 'Success' : 'Failed')
    } catch (ensureError) {
      console.error('ensureUserExists error:', ensureError)
      return NextResponse.json({ 
        error: 'Failed to ensure user exists', 
        details: ensureError instanceof Error ? ensureError.message : String(ensureError) 
      }, { status: 500 })
    }
    
    // Step 3: Verify user was created by looking it up again
    let verificationUser
    try {
      verificationUser = await User.findOne({ clerkId: userId })
      console.log('Verification lookup result:', verificationUser ? 'Found' : 'Not found')
    } catch (verifyError) {
      console.error('Error verifying user creation:', verifyError)
    }
    
    // Get all models in the database for debugging
    const modelNames = Object.keys(mongoose.models)
    console.log('Available MongoDB models:', modelNames)

    // Get stats about the collections
    let collectionStats = {}
    try {
      for (const model of Object.values(mongoose.models)) {
        const count = await model.countDocuments()
        collectionStats[model.modelName] = { count }
      }
    } catch (statsError) {
      console.error('Error getting collection stats:', statsError)
    }
    
    // Return detailed debugging information
    return NextResponse.json({
      status: 'success',
      userFromClerk: {
        clerkId: userId,
      },
      directLookup: {
        found: !!existingUser,
        data: existingUser ? {
          id: existingUser._id.toString(),
          clerkId: existingUser.clerkId,
          email: existingUser.email,
        } : null
      },
      ensureUserExists: {
        success: !!user,
        data: user ? {
          id: user._id.toString(),
          clerkId: user.clerkId,
          email: user.email,
        } : null
      },
      verification: {
        found: !!verificationUser,
        data: verificationUser ? {
          id: verificationUser._id.toString(),
          clerkId: verificationUser.clerkId,
          email: verificationUser.email,
        } : null
      },
      mongodbModels: modelNames,
      collectionStats
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

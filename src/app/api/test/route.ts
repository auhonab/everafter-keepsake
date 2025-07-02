import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'
import { User } from '@/models'

export async function GET() {
  try {
    // Check authentication status
    const { userId } = await auth()
    let authInfo: { 
      authenticated: boolean;
      userId: string | null;
      userData: any | null;
    } = { 
      authenticated: false, 
      userId: null, 
      userData: null 
    }
    
    if (userId) {
      authInfo.authenticated = true
      authInfo.userId = userId
      
      try {
        const clerkUser = await currentUser()
        if (clerkUser) {
          authInfo.userData = {
            id: clerkUser.id,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            imageUrl: clerkUser.imageUrl,
          }
        }
      } catch (authError) {
        console.error('Error getting current user:', authError)
      }
    }
    
    // Check database connection
    await dbConnect()
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
    }
    
    // Check for user in database if authenticated
    let userInDb = null
    if (userId) {
      try {
        const user = await User.findOne({ clerkId: userId })
        if (user) {
          userInDb = {
            _id: user._id.toString(),
            clerkId: user.clerkId,
            email: user.email,
            createdAt: user.createdAt,
          }
        }
      } catch (userError) {
        console.error('Error finding user in database:', userError)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Diagnostics completed',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? 
          `${process.env.MONGODB_URI.substring(0, 20)}...` : 'Not configured',
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not configured',
      },
      auth: authInfo,
      database: dbStatus,
      user: userInDb
    })
  } catch (error) {
    console.error('Diagnostics error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Diagnostics failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

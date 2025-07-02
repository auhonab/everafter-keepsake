import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Get the current Clerk user ID for logging
    const authResult = await auth();
    const userId = authResult.userId;
    
    // Check MongoDB connection status
    const dbStatus = {
      readyState: mongoose.connection.readyState,
      status: mongoose.connection.readyState === 0 ? 'disconnected' : 
              mongoose.connection.readyState === 1 ? 'connected' :
              mongoose.connection.readyState === 2 ? 'connecting' :
              mongoose.connection.readyState === 3 ? 'disconnecting' : 'unknown'
    };
    
    console.log(`Debug API called. Current Clerk userId: ${userId}`);
    console.log(`MongoDB initial connection status:`, dbStatus);
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await dbConnect();
    
    // Re-check connection status
    const dbStatusAfterConnect = {
      readyState: mongoose.connection.readyState,
      status: mongoose.connection.readyState === 0 ? 'disconnected' : 
              mongoose.connection.readyState === 1 ? 'connected' :
              mongoose.connection.readyState === 2 ? 'connecting' :
              mongoose.connection.readyState === 3 ? 'disconnecting' : 'unknown'
    };
    console.log('MongoDB status after connect:', dbStatusAfterConnect);
    
    // Count users
    console.log('Counting users in database...');
    const userCount = await User.countDocuments();
    console.log(`User count: ${userCount}`);
    
    // List all users
    const users = await User.find().select('clerkId email firstName lastName');
    console.log(`Found ${users.length} users in database`);
    
    // Test database write with a dummy user
    const testUser = new User({
      clerkId: `test-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
    });
    
    console.log('Saving test user to database...');
    const savedUser = await testUser.save();
    console.log('Test user saved successfully:', savedUser._id.toString());
    
    // Cleanup - delete the test user
    await User.findByIdAndDelete(savedUser._id);
    console.log('Test user deleted successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection is working',
      mongodbStatus: dbStatusAfterConnect,
      userCount,
      users,
      testWriteSuccessful: true,
    });
  } catch (error) {
    console.error('Database debug API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection test failed',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

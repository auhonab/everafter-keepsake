import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { Album } from '@/models'
import { ensureUserExists } from '@/lib/ensureUser'

export async function GET(request: NextRequest) {
  try {
    console.log('Albums API - GET request received');
    
    // Handle auth in a more resilient way
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
      
      if (!userId) {
        console.log('Albums API - Unauthorized: No userId from auth()');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.log('Albums API - Authorized with Clerk userId:', userId);
    } catch (authError) {
      console.error('Albums API - Auth error:', authError);
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: 'There was an issue with authentication. Please try logging out and back in.' 
      }, { status: 401 });
    }

    // Connect to database with error handling
    try {
      console.log('Albums API - Connecting to database');
      await dbConnect();
      console.log('Albums API - Database connection successful');
    } catch (dbError) {
      console.error('Albums API - Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: 'Could not connect to the database. Please try again later.' 
      }, { status: 500 });
    }
    
    // Use ensureUserExists to create the user if they don't exist yet
    let user;
    try {
      console.log('Albums API - Ensuring user exists');
      user = await ensureUserExists();
      if (!user) {
        console.log('Albums API - User not found after ensureUserExists');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.log('Albums API - User confirmed:', user._id.toString());
    } catch (userError) {
      console.error('Albums API - User creation/retrieval error:', userError);
      return NextResponse.json({ 
        error: 'User account error',
        details: 'There was an issue with your user account. Please try logging out and back in.' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Query using 'userId' field to match model
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
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Albums API - POST request received');
    const { userId } = await auth()
    
    if (!userId) {
      console.log('Albums API - Unauthorized: No userId from auth()');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('Albums API - Authorized with Clerk userId:', userId);

    let body;
    try {
      body = await request.json();
      console.log('Albums API - Request body:', JSON.stringify(body));
    } catch (parseError) {
      console.error('Albums API - Error parsing request JSON:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: 'Could not parse JSON in request body'
      }, { status: 400 });
    }
    
    const { title, description, coverImage, memories, isPrivate } = body

    if (!title) {
      console.log('Albums API - Missing required field: title');
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    console.log('Albums API - Connecting to database');
    await dbConnect()
    
    // Use ensureUserExists to create the user if they don't exist yet
    console.log('Albums API - Ensuring user exists');
    const user = await ensureUserExists()
    if (!user) {
      console.log('Albums API - User not found after ensureUserExists');
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.log('Albums API - User confirmed:', user._id.toString());

    console.log('Albums API - Creating new album document');
    const album = new Album({
      title,
      description,
      coverImage,
      memories: memories || [],
      userId: user._id, // Use 'userId' to match the Album model schema
      isPrivate: isPrivate !== undefined ? isPrivate : true,
    })

    console.log('Albums API - Saving album to database');
    await album.save()
    console.log('Albums API - Album saved successfully with ID:', album._id.toString());
    
    console.log('Albums API - Populating album references');
    await album.populate([
      { path: 'memories', select: 'title date images' },
      { path: 'userId', select: 'firstName lastName' }
    ])

    console.log('Albums API - Returning success response');
    return NextResponse.json({ album }, { status: 201 })
  } catch (error) {
    console.error('Error creating album:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

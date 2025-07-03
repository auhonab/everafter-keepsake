import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import { Milestone } from '@/models'
import { ensureUserExists } from '@/lib/ensureUser'

export async function GET(request: NextRequest) {
  try {
    console.log('Milestones API - GET request received');
    
    // Handle auth in a more resilient way
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
      
      if (!userId) {
        console.log('Milestones API - Unauthorized: No userId from auth()');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.log('Milestones API - Authorized with Clerk userId:', userId);
    } catch (authError) {
      console.error('Milestones API - Auth error:', authError);
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: 'There was an issue with authentication. Please try logging out and back in.' 
      }, { status: 401 });
    }

    // Connect to database with error handling
    try {
      console.log('Milestones API - Connecting to database');
      await dbConnect();
      console.log('Milestones API - Database connection successful');
    } catch (dbError) {
      console.error('Milestones API - Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: 'Could not connect to the database. Please try again later.' 
      }, { status: 500 });
    }
    
    // Use ensureUserExists to create the user if they don't exist yet
    let user;
    try {
      console.log('Milestones API - Ensuring user exists');
      user = await ensureUserExists();
      if (!user) {
        console.log('Milestones API - User not found after ensureUserExists');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.log('Milestones API - User confirmed:', user._id.toString());
    } catch (userError) {
      console.error('Milestones API - User creation/retrieval error:', userError);
      return NextResponse.json({ 
        error: 'User account error',
        details: 'There was an issue with your user account. Please try logging out and back in.' 
      }, { status: 500 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const upcoming = searchParams.get('upcoming') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    console.log('Milestones API - Query parameters:', { type, upcoming, page, limit });

    // Define query type
    interface MilestoneQuery {
      userId: mongoose.Types.ObjectId;
      type?: string;
      date?: { $gte: Date };
    }
    
    // Build query
    const query: MilestoneQuery = { userId: user._id }
    if (type) {
      query.type = type
    }
    if (upcoming) {
      query.date = { $gte: new Date() }
    }

    try {
      console.log('Milestones API - Querying milestones with:', query);
      
      const milestones = await Milestone.find(query)
        .sort({ date: upcoming ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName')

      const total = await Milestone.countDocuments(query)
      console.log(`Milestones API - Found ${milestones.length} milestones out of ${total} total`);

      return NextResponse.json({
        milestones,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (queryError) {
      console.error('Milestones API - Error querying milestones:', queryError);
      return NextResponse.json({ 
        error: 'Database query error',
        details: queryError instanceof Error ? queryError.message : 'Error retrieving milestones' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Milestones API - POST request received');
    
    // Handle auth in a more resilient way
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
      
      if (!userId) {
        console.log('Milestones API - Unauthorized: No userId from auth()');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.log('Milestones API - Authorized with Clerk userId:', userId);
    } catch (authError) {
      console.error('Milestones API - Auth error:', authError);
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: 'There was an issue with authentication. Please try logging out and back in.' 
      }, { status: 401 });
    }

    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
      console.log('Milestones API - Request body:', JSON.stringify(body));
    } catch (parseError) {
      console.error('Milestones API - Error parsing request JSON:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: 'Could not parse JSON in request body'
      }, { status: 400 });
    }
    
    const { title, description, date, type, location, isRecurring } = body;

    // Validate required fields
    if (!title || !date || !type) {
      console.log('Milestones API - Missing required fields');
      return NextResponse.json({ error: 'Title, date, and type are required' }, { status: 400 });
    }

    // Connect to database
    try {
      console.log('Milestones API - Connecting to database');
      await dbConnect();
      console.log('Milestones API - Database connection successful');
    } catch (dbError) {
      console.error('Milestones API - Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: 'Could not connect to the database. Please try again later.' 
      }, { status: 500 });
    }
    
    // Use ensureUserExists to create the user if they don't exist yet
    let user;
    try {
      console.log('Milestones API - Ensuring user exists');
      user = await ensureUserExists();
      if (!user) {
        console.log('Milestones API - User not found after ensureUserExists');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.log('Milestones API - User confirmed:', user._id.toString());
    } catch (userError) {
      console.error('Milestones API - User creation/retrieval error:', userError);
      return NextResponse.json({ 
        error: 'User account error',
        details: 'There was an issue with your user account. Please try logging out and back in.' 
      }, { status: 500 });
    }

    try {
      console.log('Milestones API - Creating new milestone');
      
      // Handle date properly to avoid timezone issues
      let milestoneDate;
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // If it's a YYYY-MM-DD format, treat it as local date
        const [year, month, day] = date.split('-').map(Number);
        milestoneDate = new Date(year, month - 1, day);
      } else {
        milestoneDate = new Date(date);
      }
      
      const milestone = new Milestone({
        title,
        description,
        date: milestoneDate,
        type,
        location,
        userId: user._id,
        isRecurring: isRecurring || false,
      });

      console.log('Milestones API - Saving milestone');
      await milestone.save();
      console.log('Milestones API - Milestone saved with ID:', milestone._id.toString());
      
      console.log('Milestones API - Populating milestone references');
      await milestone.populate('userId', 'firstName lastName');

      console.log('Milestones API - Returning success response');
      return NextResponse.json({ milestone }, { status: 201 });
    } catch (saveError) {
      console.error('Milestones API - Error saving milestone:', saveError);
      return NextResponse.json({ 
        error: 'Failed to save milestone',
        details: saveError instanceof Error ? saveError.message : 'Unknown database error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

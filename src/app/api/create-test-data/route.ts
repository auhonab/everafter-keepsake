import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Memory, Album, JournalEntry, LoveNote, Milestone } from '@/models';
import { ensureUserExists } from '@/lib/ensureUser';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Connected to MongoDB');
    
    // Ensure user exists and get user object
    const user = await ensureUserExists();
    console.log('User ensured:', user._id.toString());
    
    // Extract userId for creating related content
    const userId = user._id;
    
    // Create test data entries for each model
    // --------------------------------
    // Create a test memory
    const memory = new Memory({
      user: userId,
      title: `Test Memory ${Date.now()}`,
      description: 'This is a test memory created for debugging',
      date: new Date(),
      location: 'Test Location',
      imageUrl: 'https://placehold.co/400x300',
    });
    
    const savedMemory = await memory.save();
    console.log('Test memory created:', savedMemory._id.toString());
    
    // Create a test album
    const album = new Album({
      user: userId,
      title: `Test Album ${Date.now()}`,
      description: 'This is a test album created for debugging',
      coverImage: 'https://placehold.co/400x300',
      images: [{
        url: 'https://placehold.co/400x300',
        caption: 'Test image'
      }]
    });
    
    const savedAlbum = await album.save();
    console.log('Test album created:', savedAlbum._id.toString());
    
    // Create a test journal entry
    const journalEntry = new JournalEntry({
      user: userId,
      title: `Test Journal ${Date.now()}`,
      content: 'This is a test journal entry created for debugging',
      date: new Date(),
    });
    
    const savedJournal = await journalEntry.save();
    console.log('Test journal created:', savedJournal._id.toString());
    
    // Create a test love note
    const loveNote = new LoveNote({
      user: userId,
      content: `Test Love Note ${Date.now()}`,
      date: new Date(),
    });
    
    const savedLoveNote = await loveNote.save();
    console.log('Test love note created:', savedLoveNote._id.toString());
    
    // Create a test milestone
    const milestone = new Milestone({
      user: userId,
      title: `Test Milestone ${Date.now()}`,
      description: 'This is a test milestone created for debugging',
      date: new Date(),
      imageUrl: 'https://placehold.co/400x300',
    });
    
    const savedMilestone = await milestone.save();
    console.log('Test milestone created:', savedMilestone._id.toString());
    
    // Return success with all created items
    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      data: {
        user: {
          id: user._id.toString(),
          clerkId: user.clerkId,
          email: user.email
        },
        memory: {
          id: savedMemory._id.toString(),
          title: savedMemory.title
        },
        album: {
          id: savedAlbum._id.toString(),
          title: savedAlbum.title
        },
        journalEntry: {
          id: savedJournal._id.toString(),
          title: savedJournal.title
        },
        loveNote: {
          id: savedLoveNote._id.toString(),
          content: savedLoveNote.content
        },
        milestone: {
          id: savedMilestone._id.toString(),
          title: savedMilestone.title
        }
      }
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create test data',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

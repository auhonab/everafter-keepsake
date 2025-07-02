import { auth, currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'
import mongoose from 'mongoose'

/**
 * Ensures the current user exists in the database.
 * If the user doesn't exist, creates them based on Clerk user data.
 * 
 * @param {string} [forcedUserId] - Optional userId to use instead of calling auth()
 */
export async function ensureUserExists(forcedUserId?: string) {
  try {
    console.log('ensureUserExists called with forcedUserId:', forcedUserId);
    
    // Get the authenticated user ID from Clerk (or use the provided one)
    let userId = forcedUserId;
    
    if (!userId) {
      try {
        const authResult = await auth();
        userId = authResult.userId || undefined;
        console.log('Auth - Clerk userId:', userId);
      } catch (authError) {
        console.error('Auth error in ensureUserExists:', authError);
        throw new Error('Authentication error: ' + (authError instanceof Error ? authError.message : String(authError)));
      }
    }
    
    if (!userId) {
      throw new Error('Not authenticated')
    }

    // Connect to MongoDB
    try {
      await dbConnect();
      console.log('MongoDB connection established in ensureUserExists');
    } catch (dbError) {
      console.error('MongoDB connection error in ensureUserExists:', dbError);
      throw new Error('Database connection failed: ' + (dbError instanceof Error ? dbError.message : String(dbError)));
    }
    
    // Check if user already exists in the database
    console.log('Looking for user with clerkId:', userId);
    let user;
    try {
      user = await User.findOne({ clerkId: userId });
      console.log('User lookup result:', user ? 'Found' : 'Not found');
    } catch (findError) {
      console.error('Error finding user:', findError);
      throw new Error('User lookup failed: ' + (findError instanceof Error ? findError.message : String(findError)));
    }
    
    if (!user) {
      console.log('User not found in database, creating new user');
      // User doesn't exist, create a new one from Clerk data
      const clerkUser = await currentUser()
      
      if (!clerkUser) {
        throw new Error('Could not retrieve user details from Clerk')
      }

      console.log('Retrieved Clerk user data:', {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName
      });

      // Create new user in our database
      const userData = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'unknown@example.com',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImage: clerkUser.imageUrl,
      };
      
      console.log('Creating user with data:', userData);
      
      // Ensure we have a valid connection without closing the current one
      // Verify MongoDB connection state before creating user
      const connectionState = mongoose.connection.readyState;
      console.log('MongoDB connection state before user creation:', 
                connectionState === 0 ? 'disconnected' : 
                connectionState === 1 ? 'connected' : 
                connectionState === 2 ? 'connecting' :
                connectionState === 3 ? 'disconnecting' : 'unknown');
                
      // Only reconnect if not already connected
      if (connectionState !== 1) {
        console.log('MongoDB not connected, attempting to connect...');
        await dbConnect();
        console.log('MongoDB connection state after reconnection:', mongoose.connection.readyState);
      }
      
      // First check if the user already exists again (double-check)
      const existingUser = await User.findOne({ clerkId: userData.clerkId });
      if (existingUser) {
        console.log('User already exists after second check, using existing user');
        return existingUser;
      }
      
      // Create the user directly with create() instead of new + save()
      try {
        console.log('Creating user with User.create()...');
        user = await User.create(userData);
        console.log('User created successfully in database:', user._id.toString());
      } catch (saveError) {
        console.error('Error saving user to database:', saveError);
        
        // Try a different approach if the first one failed
        try {
          console.log('Trying alternative approach to create user...');
          // Use the mongoose model directly instead of the imported model
          const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            clerkId: { type: String, required: true, unique: true },
            email: { type: String, required: true },
            firstName: String,
            lastName: String,
            profileImage: String,
          }, { timestamps: true }));
          
          user = await UserModel.create(userData);
          console.log('User created with alternative approach:', user._id.toString());
        } catch (altError) {
          console.error('Alternative approach also failed:', altError);            // Last resort: try inserting directly into the collection
            try {
              console.log('Trying direct collection insertion as last resort...');
              if (!mongoose.connection.db) {
                throw new Error('No database connection available');
              }
              const result = await mongoose.connection.db.collection('users').insertOne({
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            
            if (result.insertedId) {
              console.log('User inserted directly into collection:', result.insertedId);
              // Fetch the inserted user
              user = await User.findOne({ clerkId: userData.clerkId });
              if (!user) {
                throw new Error('User was inserted but could not be retrieved');
              }
            } else {
              throw new Error('Direct insertion failed');
            }
          } catch (directError) {
            console.error('All user creation methods failed:', directError);
            throw new Error('Failed to save user to database after multiple attempts: ' + 
                          (saveError instanceof Error ? saveError.message : String(saveError)));
          }
        }
      }
    } else {
      console.log('User found in database:', user._id.toString());
    }

    return user
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    throw error
  }
}

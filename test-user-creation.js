// Script to test user creation directly in MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

async function testUserCreation() {
  console.log('Testing direct user creation in MongoDB...');
  
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
  }
  
  console.log(`MongoDB URI found: ${MONGODB_URI.substring(0, 20)}...`);
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Define User model for testing
    const userSchema = new mongoose.Schema({
      clerkId: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      profileImage: {
        type: String,
      },
    }, {
      timestamps: true,
    });
    
    // Check if the model already exists before creating it
    const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Create a test user with random values to avoid uniqueness conflicts
    const testUserId = `test-${Date.now()}`;
    const testUser = {
      clerkId: testUserId,
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      profileImage: 'https://example.com/test.jpg',
    };
    
    console.log('Creating test user with data:', testUser);
    
    // Try to create the user
    const createdUser = await UserModel.create(testUser);
    
    console.log('✅ User created successfully!');
    console.log('User ID:', createdUser._id);
    console.log('User data:', createdUser.toJSON());
    
    // Check if we can find the user
    const foundUser = await UserModel.findOne({ clerkId: testUserId });
    
    if (foundUser) {
      console.log('✅ User found in database successfully!');
    } else {
      console.log('❌ User not found in database after creation!');
    }
    
    // Delete the test user
    await UserModel.findByIdAndDelete(createdUser._id);
    console.log('✅ Test user deleted successfully');
    
    // List all users in the database
    const users = await UserModel.find();
    
    console.log(`\nTotal users in database: ${users.length}`);
    if (users.length > 0) {
      console.log('First few users:');
      users.slice(0, 3).forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user._id}, ClerkID: ${user.clerkId}, Email: ${user.email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during user creation test:', error);
  } finally {
    try {
      await mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
    process.exit(0);
  }
}

testUserCreation();

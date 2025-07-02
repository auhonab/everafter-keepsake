// Simple script to test MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
  }
  
  console.log(`MongoDB URI found: ${MONGODB_URI.substring(0, 20)}...`);
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ SUCCESS: Successfully connected to MongoDB!');
    
    // Test creating a simple document in a test collection
    const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({
      test: String,
      createdAt: { type: Date, default: Date.now }
    }));
    
    console.log('Testing write operation...');
    const testDoc = await TestModel.create({
      test: 'Test connection ' + new Date().toISOString()
    });
    
    console.log('✅ SUCCESS: Successfully wrote to database!');
    console.log(`Created document with ID: ${testDoc._id}`);
    
    // Count documents to verify read operations
    const count = await TestModel.countDocuments();
    console.log(`✅ SUCCESS: Read operation successful. Total test documents: ${count}`);
    
    // Delete the test document we created (cleanup)
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('✅ SUCCESS: Successfully deleted test document');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nExisting collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Display connection details
    console.log('\nConnection details:');
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Port: ${mongoose.connection.port}`);
    
  } catch (error) {
    console.error('❌ ERROR: MongoDB connection test failed');
    console.error(error);
  } finally {
    // Close the connection
    try {
      await mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
    process.exit(0);
  }
}

testConnection();

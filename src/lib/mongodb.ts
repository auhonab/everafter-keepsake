import mongoose from 'mongoose'

// Define connection state values as constants
const DISCONNECTED = 0;
const CONNECTED = 1;
const CONNECTING = 2;
const DISCONNECTING = 3;

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  )
}

// Set mongoose options to handle deprecation warnings
mongoose.set('strictQuery', false)

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  // This is for the cached connection object, not mongoose itself
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } // This must be a `var` and not a `let / const`
}

// Initialize cached connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  try {
    // If the connection is ready, return it
    if (cached.conn && (mongoose.connection.readyState as number) === CONNECTED) {
      console.log('Using existing MongoDB connection');
      return cached.conn;
    }
    
    // If we're in a connecting state, wait a bit
    if ((mongoose.connection.readyState as number) === CONNECTING) {
      console.log('MongoDB connection in progress, waiting...');
      // Wait a bit for the connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if now connected
      if ((mongoose.connection.readyState as number) === CONNECTED) {
        console.log('MongoDB connection now ready after waiting');
        cached.conn = mongoose;
        return cached.conn;
      }
    }

    // Clear any existing promise that might be stale
    if ((mongoose.connection.readyState as number) !== CONNECTED) {
      cached.promise = null;
    }

    if (!cached.promise) {
      console.log('Establishing new MongoDB connection to:', MONGODB_URI?.substring(0, 20) + '...');
      
      // Close any existing connection that's not in connected state
      if ((mongoose.connection.readyState as number) !== DISCONNECTED && 
          (mongoose.connection.readyState as number) !== CONNECTED) {
        try {
          console.log('Closing existing MongoDB connection in state:', mongoose.connection.readyState);
          await mongoose.connection.close();
        } catch (closeErr) {
          console.error('Error closing MongoDB connection:', closeErr);
        }
      }
      
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI as string, opts) as Promise<mongoose.Mongoose>;
    }

    console.log('Awaiting MongoDB connection...');
    cached.conn = await cached.promise;
    
    // Verify connection is alive
    if ((mongoose.connection.readyState as number) !== CONNECTED) {
      console.error('MongoDB connection not in ready state:', mongoose.connection.readyState);
      cached.promise = null;
      throw new Error(`MongoDB connection not ready. State: ${mongoose.connection.readyState}`);
    }
    
    console.log('MongoDB connection is ready. ReadyState:', mongoose.connection.readyState);
    return cached.conn;
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;

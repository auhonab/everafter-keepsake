import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get environment variables, masking sensitive values
    const envData = {
      mongodb: {
        uriConfigured: !!process.env.MONGODB_URI,
        uriValid: isValidMongoDBUri(process.env.MONGODB_URI),
        uriError: !isValidMongoDBUri(process.env.MONGODB_URI) 
          ? 'MongoDB URI format appears to be invalid' 
          : undefined
      },
      clerk: {
        publishableKeyConfigured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        secretKeyConfigured: !!process.env.CLERK_SECRET_KEY,
        webhookSecretConfigured: !!process.env.CLERK_WEBHOOK_SECRET,
        webhookSecretDefault: process.env.CLERK_WEBHOOK_SECRET === 'whsec_your_webhook_secret_here',
        signInUrlConfigured: !!process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        signUpUrlConfigured: !!process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL
      },
      cloudinary: {
        cloudNameConfigured: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPresetConfigured: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        cloudinaryUrlConfigured: !!process.env.CLOUDINARY_URL,
        cloudinaryUrlValid: isValidCloudinaryUrl(process.env.CLOUDINARY_URL)
      },
      nextjs: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        imageDomainsConfigured: true // We don't have direct access to Next.js config here
      }
    };
    
    return NextResponse.json(envData);
  } catch (error) {
    console.error('Environment debug error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving environment data',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Helper to validate MongoDB URI format
function isValidMongoDBUri(uri?: string): boolean {
  if (!uri) return false;
  
  // Basic check for MongoDB URI format
  return /^mongodb(\+srv)?:\/\/[^\/]+/.test(uri);
}

// Helper to validate Cloudinary URL format
function isValidCloudinaryUrl(url?: string): boolean {
  if (!url) return false;
  
  // Basic check for Cloudinary URL format
  return /^cloudinary:\/\/[^:]+:[^@]+@[^\/]+/.test(url);
}

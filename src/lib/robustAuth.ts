import { auth as clerkAuth } from '@clerk/nextjs/server'

/**
 * Enhanced auth function that works even when middleware hasn't run
 * This is a fallback solution for when middleware isn't in the correct location
 */
export async function robustAuth() {
  try {
    // Try to use the standard Clerk auth
    const authResult = await clerkAuth();
    return authResult;
  } catch (error) {
    console.error('Clerk auth error:', error);
    
    // Return a safe default without throwing
    return {
      userId: null,
      sessionId: null,
      getToken: async () => null,
    };
  }
}

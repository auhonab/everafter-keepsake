import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/api/webhooks(.*)', // Allow webhook endpoints
  '/debug(.*)', // Allow debug endpoints without auth
  '/auth-debug(.*)', // Allow auth debug page
])

export default clerkMiddleware(async (auth, req) => {
  // Log to help with debugging
  console.log(`Middleware processing: ${req.method} ${req.nextUrl.pathname}`)
  
  try {
    // Allow access to public routes
    if (isPublicRoute(req)) {
      console.log(`Public route accessed: ${req.nextUrl.pathname}`)
      return
    }
    
    // Protect all other routes
    await auth.protect()
  } catch (error) {
    console.error(`Middleware error for ${req.nextUrl.pathname}:`, error)
    // Continue processing - the API routes will handle auth errors
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

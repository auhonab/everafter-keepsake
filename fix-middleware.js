/**
 * This script fixes the middleware issue by copying the middleware file to the correct location
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootMiddlewarePath = path.join(__dirname, 'middleware.ts');
const srcMiddlewarePath = path.join(__dirname, 'src', 'middleware.ts');

// Check if files exist
const rootExists = fs.existsSync(rootMiddlewarePath);
const srcExists = fs.existsSync(srcMiddlewarePath);

console.log('Middleware Fix Script');
console.log('-----------------------');
console.log(`Root middleware (${rootMiddlewarePath}): ${rootExists ? 'EXISTS' : 'MISSING'}`);
console.log(`Src middleware (${srcMiddlewarePath}): ${srcExists ? 'EXISTS' : 'MISSING'}`);

// Create src directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'src'))) {
  console.log('Creating src directory...');
  fs.mkdirSync(path.join(__dirname, 'src'));
}

// If src middleware doesn't exist but root does, copy from root to src
if (!srcExists && rootExists) {
  console.log('Copying middleware from root to src directory...');
  fs.copyFileSync(rootMiddlewarePath, srcMiddlewarePath);
  console.log('Middleware copied successfully!');
} else if (!srcExists && !rootExists) {
  // Create a basic middleware file in both locations
  console.log('Creating new middleware files...');
  
  const middlewareContent = `import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/api/webhooks(.*)',
  '/debug(.*)',
  '/auth-debug(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes
  if (isPublicRoute(req)) {
    return
  }
  
  // Protect all other routes
  await auth.protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}`;
  
  fs.writeFileSync(srcMiddlewarePath, middlewareContent);
  console.log('Src middleware created successfully!');
  
  // Create a reference file in the root directory
  const rootMiddlewareContent = `/**
 * This file exists for compatibility with certain Next.js versions.
 * The actual middleware implementation is in src/middleware.ts
 */

// Re-export from the src directory to ensure both files are identical
export { default } from './src/middleware'
export { config } from './src/middleware'`;
  
  fs.writeFileSync(rootMiddlewarePath, rootMiddlewareContent);
  console.log('Root middleware created successfully!');
}

console.log('\nFix completed! Please restart your Next.js server.');

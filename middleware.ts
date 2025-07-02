/**
 * This file exists for compatibility with certain Next.js versions.
 * The actual middleware implementation is in src/middleware.ts
 */

// Re-export from the src directory to ensure both files are identical
export { default } from './src/middleware'
export { config } from './src/middleware'

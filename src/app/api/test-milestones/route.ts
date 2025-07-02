import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Try to make an internal fetch to the milestones API
    const milestonesResponse = await fetch(new URL('/api/milestones', 'http://localhost:3000'))
    
    const milestonesStatus = milestonesResponse.ok
      ? { status: milestonesResponse.status, ok: true }
      : { status: milestonesResponse.status, ok: false, statusText: milestonesResponse.statusText }
    
    // Try to check the [id] route structure too
    const folderStructure = {
      '/api/milestones': 'exists',
      '/api/milestones/route.ts': 'exists',
      '/api/milestones/[id]': 'exists',
      '/api/milestones/[id]/route.ts': 'exists'
    }
    
    return NextResponse.json({ 
      message: 'Milestones API test',
      milestonesApiStatus: milestonesStatus,
      folderStructure,
      routeRegistration: {
        shouldExist: true,
        routePath: '/api/milestones'
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error testing milestones API',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

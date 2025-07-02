import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

export async function POST(request: NextRequest) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await request.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  try {
    await dbConnect()

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Error occurred', { status: 500 })
  }
}

async function handleUserCreated(userData: any) {
  try {
    const user = new User({
      clerkId: userData.id,
      email: userData.email_addresses[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
      profileImage: userData.image_url,
    })

    await user.save()
    console.log('User created in MongoDB:', user.clerkId)
  } catch (error) {
    console.error('Error creating user in MongoDB:', error)
  }
}

async function handleUserUpdated(userData: any) {
  try {
    await User.findOneAndUpdate(
      { clerkId: userData.id },
      {
        email: userData.email_addresses[0]?.email_address,
        firstName: userData.first_name,
        lastName: userData.last_name,
        profileImage: userData.image_url,
      }
    )
    console.log('User updated in MongoDB:', userData.id)
  } catch (error) {
    console.error('Error updating user in MongoDB:', error)
  }
}

async function handleUserDeleted(userData: any) {
  try {
    await User.findOneAndDelete({ clerkId: userData.id })
    console.log('User deleted from MongoDB:', userData.id)
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error)
  }
}

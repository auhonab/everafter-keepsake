# EverAfter Keepsake - MongoDB Integration

This document outlines the MongoDB database integration for the EverAfter Keepsake application.

## Database Structure

The application uses the following MongoDB collections:

### Users
- **clerkId**: Unique identifier from Clerk authentication
- **email**: User's email address
- **firstName**: User's first name
- **lastName**: User's last name
- **profileImage**: URL to user's profile image
- **partner**: Reference to partner user (for couples)

### Memories
- **title**: Memory title
- **description**: Optional description
- **date**: Date when the memory occurred
- **images**: Array of image URLs
- **location**: Optional location
- **tags**: Array of tags for categorization
- **userId**: Reference to the user who created the memory
- **isPrivate**: Whether the memory is private

### Albums
- **title**: Album title
- **description**: Optional description
- **coverImage**: Cover image URL
- **memories**: Array of memory references
- **userId**: Reference to the user who created the album
- **isPrivate**: Whether the album is private

### Journal Entries
- **title**: Entry title
- **content**: Entry content
- **mood**: Optional mood (happy, excited, grateful, romantic, nostalgic, peaceful, other)
- **date**: Entry date
- **tags**: Array of tags
- **userId**: Reference to the user
- **isPrivate**: Whether the entry is private

### Love Notes
- **title**: Optional note title
- **content**: Note content
- **recipient**: Reference to recipient user
- **sender**: Reference to sender user
- **isRead**: Whether the note has been read
- **scheduledFor**: Optional scheduled delivery date
- **style**: Note style (romantic, playful, grateful, supportive, funny)

### Milestones
- **title**: Milestone title
- **description**: Optional description
- **date**: Milestone date
- **type**: Type (anniversary, first_date, engagement, wedding, birthday, custom)
- **image**: Optional image URL
- **location**: Optional location
- **userId**: Reference to the user
- **isRecurring**: Whether the milestone repeats annually

## API Endpoints

### User Management
- `GET /api/users` - Get current user
- `POST /api/users` - Create/update user
- `PUT /api/users` - Update user profile

### Memories
- `GET /api/memories` - Get memories (with pagination and filtering)
- `POST /api/memories` - Create new memory
- `GET /api/memories/[id]` - Get specific memory
- `PUT /api/memories/[id]` - Update memory
- `DELETE /api/memories/[id]` - Delete memory

### Journal
- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create new journal entry

### Love Notes
- `GET /api/love-notes` - Get love notes (sent/received)
- `POST /api/love-notes` - Create new love note

### Albums
- `GET /api/albums` - Get albums
- `POST /api/albums` - Create new album

### Milestones
- `GET /api/milestones` - Get milestones
- `POST /api/milestones` - Create new milestone

### Dashboard
- `GET /api/dashboard` - Get dashboard summary data

### Webhooks
- `POST /api/webhooks/clerk` - Clerk user event webhook

### Testing
- `GET /api/test` - Test database connection

## Environment Variables

Make sure the following environment variables are set in your `.env` file:

```
MONGODB_URI=your_mongodb_connection_string
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

## Frontend Integration

Use the provided `useApi` hook and `api` utilities for frontend data operations:

```typescript
import { api } from '@/hooks/useApi'

// Get dashboard data
const dashboard = await api.getDashboard()

// Create a memory
const memory = await api.createMemory({
  title: "Our First Date",
  description: "A magical evening...",
  date: "2024-01-15",
  tags: ["first date", "restaurant"]
})
```

## Database Connection

The MongoDB connection is managed through the `dbConnect` function in `src/lib/mongodb.ts`, which:
- Maintains a cached connection in development
- Handles connection errors gracefully
- Uses proper TypeScript types

## Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to any page with the `DatabaseTest` component
3. Click "Test Database Connection" to verify connectivity

## Webhooks Setup

To sync Clerk users with MongoDB:

1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Add a new webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the webhook secret to your `.env` file

## Data Models

All MongoDB models are defined in `src/models/` with proper TypeScript interfaces. The models include:
- Proper indexing for performance
- Validation rules
- Relationships between collections
- Timestamp tracking

## Security

- All API routes are protected with Clerk authentication
- Users can only access their own data
- Input validation on all endpoints
- Proper error handling and logging

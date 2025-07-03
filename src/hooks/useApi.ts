import { useState, useEffect } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        })
      }
    }

    fetchData()
  }, [url, options])

  return state
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    // Add request debugging
    console.log(`API Request: ${options?.method || 'GET'} ${url}`);
    if (options?.body) {
      console.log('Request body:', options.body);
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    // Add response debugging
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        errorMessage = errorData.error || errorMessage;
      } catch {
        console.error('Could not parse error response as JSON');
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Import needed interfaces
import type { IUser } from '../models/User';
import type { IMemory } from '../models/Memory';
import type { IJournalEntry } from '../models/JournalEntry';
import type { ILoveNote } from '../models/LoveNote';
import type { IAlbum } from '../models/Album';
import type { IMilestone } from '../models/Milestone';

// Type for user update payload
interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  partner?: string;
  [key: string]: unknown;
}

// Memory creation/update payload
interface MemoryPayload {
  title: string;
  description?: string;
  date: Date | string;
  images?: string[];
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  locationName?: string;
  tags?: string[];
  isPrivate?: boolean;
}

// Journal entry creation/update payload
interface JournalEntryPayload {
  title: string;
  content: string;
  mood?: 'happy' | 'excited' | 'grateful' | 'romantic' | 'nostalgic' | 'peaceful' | 'other';
  date: Date | string;
  isPrivate?: boolean;
  tags?: string[];
}

// Love note creation/update payload
interface LoveNotePayload {
  title?: string;
  content: string;
  recipient: string;
  isRead?: boolean;
  scheduledFor?: Date | string;
  style?: 'romantic' | 'playful' | 'grateful' | 'supportive' | 'funny';
}

// Album creation/update payload
interface AlbumPayload {
  title: string;
  description?: string;
  coverImage?: string;
  memories?: string[];
  isPrivate?: boolean;
}

// Milestone creation/update payload
interface MilestonePayload {
  title: string;
  description?: string;
  date: Date | string;
  type: 'anniversary' | 'first_date' | 'engagement' | 'wedding' | 'birthday' | 'custom';
  location?: string;
  isRecurring?: boolean;
}

// Dashboard data structure
interface DashboardData {
  recentMemories: IMemory[];
  upcomingMilestones: IMilestone[];
  journalCount: number;
  memoryCount: number;
  unreadLoveNotes: number;
  [key: string]: unknown;
}

// Specific API functions
export const api = {
  // User operations
  getUser: () => apiRequest<IUser>('/api/users'),
  updateUser: (data: UserUpdatePayload) => apiRequest<IUser>('/api/users', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Dashboard
  getDashboard: () => apiRequest<DashboardData>('/api/dashboard'),

  // Memories
  getMemories: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest<IMemory[]>(`/api/memories${query}`)
  },
  createMemory: (data: MemoryPayload) => apiRequest<IMemory>('/api/memories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMemory: (id: string, data: Partial<MemoryPayload>) => apiRequest<IMemory>(`/api/memories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMemory: (id: string) => apiRequest<{ success: boolean }>(`/api/memories/${id}`, {
    method: 'DELETE',
  }),

  // Journal entries
  getJournalEntries: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest<IJournalEntry[]>(`/api/journal${query}`)
  },
  getJournalEntry: (id: string) => apiRequest<IJournalEntry>(`/api/journal/${id}`),
  createJournalEntry: (data: JournalEntryPayload) => apiRequest<IJournalEntry>('/api/journal', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateJournalEntry: (id: string, data: Partial<JournalEntryPayload>) => apiRequest<IJournalEntry>(`/api/journal/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteJournalEntry: (id: string) => apiRequest<{ success: boolean }>(`/api/journal/${id}`, {
    method: 'DELETE',
  }),

  // Love notes
  getLoveNotes: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest<ILoveNote[]>(`/api/love-notes${query}`)
  },
  getLoveNote: (id: string) => apiRequest<ILoveNote>(`/api/love-notes/${id}`),
  createLoveNote: (data: LoveNotePayload) => apiRequest<ILoveNote>('/api/love-notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLoveNote: (id: string, data: Partial<LoveNotePayload>) => apiRequest<ILoveNote>(`/api/love-notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteLoveNote: (id: string) => apiRequest<{ success: boolean }>(`/api/love-notes/${id}`, {
    method: 'DELETE',
  }),

  // Albums
  getAlbums: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest<IAlbum[]>(`/api/albums${query}`)
  },
  getAlbum: (id: string) => apiRequest<IAlbum>(`/api/albums/${id}`),
  createAlbum: (data: AlbumPayload) => apiRequest<IAlbum>('/api/albums', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAlbum: (id: string, data: Partial<AlbumPayload>) => apiRequest<IAlbum>(`/api/albums/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteAlbum: (id: string) => apiRequest<{ success: boolean }>(`/api/albums/${id}`, {
    method: 'DELETE',
  }),

  // Milestones
  getMilestones: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest<IMilestone[]>(`/api/milestones${query}`)
  },
  getMilestone: (id: string) => apiRequest<IMilestone>(`/api/milestones/${id}`),
  createMilestone: (data: MilestonePayload) => apiRequest<IMilestone>('/api/milestones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMilestone: (id: string, data: Partial<MilestonePayload>) => apiRequest<IMilestone>(`/api/milestones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteMilestone: (id: string) => apiRequest<{ success: boolean }>(`/api/milestones/${id}`, {
    method: 'DELETE',
  }),

  // Test database connection
  testConnection: () => apiRequest<{ success: boolean; message: string }>('/api/test'),
}

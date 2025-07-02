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
  }, [url])

  return state
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Specific API functions
export const api = {
  // User operations
  getUser: () => apiRequest('/api/users'),
  updateUser: (data: any) => apiRequest('/api/users', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Dashboard
  getDashboard: () => apiRequest('/api/dashboard'),

  // Memories
  getMemories: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/memories${query}`)
  },
  createMemory: (data: any) => apiRequest('/api/memories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMemory: (id: string, data: any) => apiRequest(`/api/memories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMemory: (id: string) => apiRequest(`/api/memories/${id}`, {
    method: 'DELETE',
  }),

  // Journal entries
  getJournalEntries: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/journal${query}`)
  },
  createJournalEntry: (data: any) => apiRequest('/api/journal', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Love notes
  getLoveNotes: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/love-notes${query}`)
  },
  createLoveNote: (data: any) => apiRequest('/api/love-notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Albums
  getAlbums: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/albums${query}`)
  },
  createAlbum: (data: any) => apiRequest('/api/albums', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Milestones
  getMilestones: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/milestones${query}`)
  },
  createMilestone: (data: any) => apiRequest('/api/milestones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Test database connection
  testConnection: () => apiRequest('/api/test'),
}

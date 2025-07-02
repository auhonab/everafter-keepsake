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
      } catch (e) {
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
  getJournalEntry: (id: string) => apiRequest(`/api/journal/${id}`),
  createJournalEntry: (data: any) => apiRequest('/api/journal', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateJournalEntry: (id: string, data: any) => apiRequest(`/api/journal/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteJournalEntry: (id: string) => apiRequest(`/api/journal/${id}`, {
    method: 'DELETE',
  }),

  // Love notes
  getLoveNotes: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/love-notes${query}`)
  },
  getLoveNote: (id: string) => apiRequest(`/api/love-notes/${id}`),
  createLoveNote: (data: any) => apiRequest('/api/love-notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLoveNote: (id: string, data: any) => apiRequest(`/api/love-notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteLoveNote: (id: string) => apiRequest(`/api/love-notes/${id}`, {
    method: 'DELETE',
  }),

  // Albums
  getAlbums: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/albums${query}`)
  },
  getAlbum: (id: string) => apiRequest(`/api/albums/${id}`),
  createAlbum: (data: any) => apiRequest('/api/albums', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAlbum: (id: string, data: any) => apiRequest(`/api/albums/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteAlbum: (id: string) => apiRequest(`/api/albums/${id}`, {
    method: 'DELETE',
  }),

  // Milestones
  getMilestones: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/milestones${query}`)
  },
  getMilestone: (id: string) => apiRequest(`/api/milestones/${id}`),
  createMilestone: (data: any) => apiRequest('/api/milestones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMilestone: (id: string, data: any) => apiRequest(`/api/milestones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteMilestone: (id: string) => apiRequest(`/api/milestones/${id}`, {
    method: 'DELETE',
  }),

  // Test database connection
  testConnection: () => apiRequest('/api/test'),
}

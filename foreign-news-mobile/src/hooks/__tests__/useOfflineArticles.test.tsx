import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useOfflineArticles } from '../useOfflineArticles'
import { supabase } from '../../integrations/supabase/client'
import { MMKV } from 'react-native-mmkv'
import { PostgrestFilterBuilder } from '@supabase/postgrest-js'

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  const mockStorage = {
    getString: jest.fn(),
    set: jest.fn(),
  }
  return {
    MMKV: jest.fn(() => mockStorage),
  }
})

const mockArticles = [
  {
    id: 1,
    title: 'Test Article 1',
    published_at: '2024-01-13T00:00:00Z',
  },
  {
    id: 2,
    title: 'Test Article 2',
    published_at: '2024-01-12T00:00:00Z',
  },
]

// Create a mock builder that implements the chain methods
const createMockBuilder = () => {
  let builder: Partial<PostgrestFilterBuilder<any, any, any>>

  builder = {
    select: jest.fn().mockImplementation(() => builder),
    order: jest.fn().mockImplementation(() => builder),
    then: jest.fn().mockImplementation((onfulfilled) => 
      Promise.resolve({ data: mockArticles, error: null }).then(onfulfilled)
    ),
  }

  return builder
}

jest.mock('../../integrations/supabase/client', () => ({
  from: jest.fn(() => createMockBuilder()),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useOfflineArticles', () => {
  const storage = new MMKV()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch and cache articles successfully', async () => {
    const { result } = renderHook(() => useOfflineArticles(), {
      wrapper: createWrapper(),
    })

    // Initial state
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.data).toBeUndefined()

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual(mockArticles)
    expect(supabase.from).toHaveBeenCalledWith('articles')
    expect(storage.set).toHaveBeenCalledWith('articles', JSON.stringify(mockArticles))
  })

  it('should fallback to cached data when online fetch fails', async () => {
    const cachedArticles = [{ id: 3, title: 'Cached Article' }]
    ;(storage.getString as jest.Mock).mockReturnValue(JSON.stringify(cachedArticles))

    const errorBuilder = createMockBuilder()
    errorBuilder.then = jest.fn().mockImplementation((onfulfilled) =>
      Promise.resolve({ data: null, error: new Error('Network error') }).then(onfulfilled)
    )
    ;(supabase.from as jest.Mock).mockReturnValue(errorBuilder)

    const { result } = renderHook(() => useOfflineArticles(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.data).toEqual(cachedArticles)
    expect(storage.getString).toHaveBeenCalledWith('articles')
  })

  it('should return empty array when no cached data exists and fetch fails', async () => {
    ;(storage.getString as jest.Mock).mockReturnValue(null)

    const errorBuilder = createMockBuilder()
    errorBuilder.then = jest.fn().mockImplementation((onfulfilled) =>
      Promise.resolve({ data: null, error: new Error('Network error') }).then(onfulfilled)
    )
    ;(supabase.from as jest.Mock).mockReturnValue(errorBuilder)

    const { result } = renderHook(() => useOfflineArticles(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.data).toEqual([])
    expect(storage.getString).toHaveBeenCalledWith('articles')
  })

  it('should respect the enabled option', async () => {
    const { result } = renderHook(
      () => useOfflineArticles({ enabled: false }),
      {
        wrapper: createWrapper(),
      }
    )

    // Wait for any potential async operations
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toBeUndefined()
    expect(supabase.from).not.toHaveBeenCalled()
    expect(storage.getString).not.toHaveBeenCalled()
  })
})

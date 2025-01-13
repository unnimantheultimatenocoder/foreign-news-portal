import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSavedArticles } from '../useSavedArticles'
import { supabase } from '../../integrations/supabase/client'
import { getCachedSavedArticles, cacheSavedArticles } from '../../lib/storage'

jest.mock('../../lib/storage', () => ({
  getCachedSavedArticles: jest.fn().mockResolvedValue([]),
  cacheSavedArticles: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('../../integrations/supabase/client', () => {
  const mockSelect = jest.fn().mockResolvedValue({ 
    data: [
      { 
        created_at: '2024-01-13T00:00:00Z',
        progress: 0,
        articles: {
          id: 1,
          title: 'Test Article'
        }
      }
    ], 
    error: null 
  })
  const mockEq = jest.fn().mockReturnThis()
  const mockOrder = jest.fn().mockReturnThis()
  const mockFrom = jest.fn(() => ({
    select: mockSelect,
    eq: mockEq,
    order: mockOrder,
  }))
  return {
    from: mockFrom,
  }
})

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

describe('useSavedArticles', () => {
  const mockUserId = 'test-user-id'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch saved articles successfully', async () => {
    const { result } = renderHook(() => useSavedArticles(mockUserId), {
      wrapper: createWrapper(),
    })

    // Initial state
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.data).toBeUndefined()

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([{
      id: 1,
      title: 'Test Article',
      saved_at: '2024-01-13T00:00:00Z',
      progress: 0
    }])
    expect(supabase.from).toHaveBeenCalledWith('reading_progress')
    expect(cacheSavedArticles).toHaveBeenCalled()
  })

  it('should handle errors by returning cached data', async () => {
    const errorMessage = 'Failed to fetch saved articles'
    const mockSelect = jest.fn().mockResolvedValue({ data: null, error: new Error(errorMessage) })
    const mockEq = jest.fn().mockReturnThis()
    const mockOrder = jest.fn().mockReturnThis()
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder,
    })

    const { result } = renderHook(() => useSavedArticles(mockUserId), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isError).toBeFalsy() // Should not be error since we fallback to cache
    expect(result.current.data).toEqual([]) // Empty array from getCachedSavedArticles mock
    expect(getCachedSavedArticles).toHaveBeenCalled()
  })

  it('should not fetch articles when userId is not provided', async () => {
    const { result } = renderHook(() => useSavedArticles(undefined), {
      wrapper: createWrapper(),
    })

    // Wait for any potential async operations
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([]) // Returns empty array when no userId
    expect(supabase.from).not.toHaveBeenCalled()
  })
})

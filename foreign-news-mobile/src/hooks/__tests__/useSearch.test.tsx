import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSearch } from '../useSearch'
import { supabase } from '../../integrations/supabase/client'
import { Article } from '../../types/article'

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Test Article About Technology',
    summary: 'A summary about tech',
    image_url: 'https://example.com/image1.jpg',
    source: 'Tech News',
    original_url: 'https://example.com/article1',
    published_at: '2024-01-13T00:00:00Z',
    category_id: 'tech-123',
    status: 'published',
    source_id: 'tech-news-1',
    created_at: '2024-01-13T00:00:00Z',
    updated_at: null,
    moderated_at: null,
    moderated_by: null,
    scheduled_for: null,
  },
  {
    id: '2',
    title: 'Another Tech Article',
    summary: 'More tech content',
    image_url: 'https://example.com/image2.jpg',
    source: 'Tech News',
    original_url: 'https://example.com/article2',
    published_at: '2024-01-12T00:00:00Z',
    category_id: 'tech-123',
    status: 'published',
    source_id: 'tech-news-1',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: null,
    moderated_at: null,
    moderated_by: null,
    scheduled_for: null,
  },
]

// Mock the Supabase client
jest.mock('../../integrations/supabase/client', () => {
  return {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        or: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              then: (onfulfilled: (value: { data: Article[]; error: null }) => any) =>
                Promise.resolve({ data: mockArticles, error: null }).then(onfulfilled),
            })),
          })),
        })),
      })),
    })),
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

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should search articles successfully', async () => {
    const searchTerm = 'tech'
    const { result } = renderHook(() => useSearch(searchTerm), {
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
  })

  it('should return empty array for no results', async () => {
    const emptyData = { data: [], error: null }
    ;(supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn(() => ({
        or: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              then: (onfulfilled: (value: { data: Article[]; error: null }) => any) =>
                Promise.resolve(emptyData).then(onfulfilled),
            })),
          })),
        })),
      })),
    }))

    const { result } = renderHook(() => useSearch('nonexistent'), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.data).toEqual([])
  })

  it('should return empty array for empty search term', async () => {
    const { result } = renderHook(() => useSearch('  '), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.data).toEqual([])
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('should handle errors when searching articles', async () => {
    const errorMessage = 'Failed to search articles'
    const errorData = { data: null, error: new Error(errorMessage) }
    ;(supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn(() => ({
        or: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              then: (onfulfilled: (value: { data: Article[] | null; error: Error }) => any) =>
                Promise.resolve(errorData).then(onfulfilled),
            })),
          })),
        })),
      })),
    }))

    const { result } = renderHook(() => useSearch('tech'), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isError).toBeTruthy()
    expect(result.current.error?.message).toBe(errorMessage)
  })

  it('should respect the enabled option', async () => {
    const { result } = renderHook(
      () => useSearch('tech', { enabled: false }),
      {
        wrapper: createWrapper(),
      }
    )

    // Wait for any potential async operations
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toBeUndefined()
    expect(supabase.from).not.toHaveBeenCalled()
  })
})

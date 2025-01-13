import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCategoryArticles } from '../useCategoryArticles'
import { supabase } from '../../integrations/supabase/client'
import { PostgrestFilterBuilder } from '@supabase/postgrest-js'

const mockArticles = [
  {
    id: 1,
    title: 'Test Article 1',
    category_id: 'test-category',
    published_at: '2024-01-13T00:00:00Z',
  },
  {
    id: 2,
    title: 'Test Article 2',
    category_id: 'test-category',
    published_at: '2024-01-12T00:00:00Z',
  },
]

// Create a mock builder that implements the chain methods
const createMockBuilder = () => {
  let builder: Partial<PostgrestFilterBuilder<any, any, any>>

  builder = {
    select: jest.fn().mockImplementation(() => builder),
    eq: jest.fn().mockImplementation(() => builder),
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

describe('useCategoryArticles', () => {
  const categoryId = 'test-category'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch category articles successfully', async () => {
    const { result } = renderHook(() => useCategoryArticles(categoryId), {
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

  it('should handle errors when fetching category articles', async () => {
    const errorMessage = 'Failed to fetch category articles'
    const errorBuilder = createMockBuilder()
    errorBuilder.then = jest.fn().mockImplementation((onfulfilled) =>
      Promise.resolve({ data: null, error: new Error(errorMessage) }).then(onfulfilled)
    )
    ;(supabase.from as jest.Mock).mockReturnValue(errorBuilder)

    const { result } = renderHook(() => useCategoryArticles(categoryId), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.data).toEqual([]) // Returns empty array on error
    expect(result.current.error).toBeNull() // Error is caught and handled
  })

  it('should respect the enabled option', async () => {
    const { result } = renderHook(
      () => useCategoryArticles(categoryId, { enabled: false }),
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

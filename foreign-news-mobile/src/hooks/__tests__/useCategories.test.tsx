import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCategories } from '../useCategories'
import { supabase } from '../../integrations/supabase/client'

jest.mock('../../integrations/supabase/client', () => {
  const mockSelect = jest.fn().mockResolvedValue({ data: [], error: null })
  const mockOrder = jest.fn().mockReturnThis()
  const mockFrom = jest.fn(() => ({
    select: mockSelect,
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

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch categories successfully', async () => {
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    })

    // Initial state
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.data).toBeUndefined()

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([])
    expect(supabase.from).toHaveBeenCalledWith('categories')
  })

  it('should handle errors when fetching categories', async () => {
    const errorMessage = 'Failed to fetch categories'
    const mockSelect = jest.fn().mockResolvedValue({ data: null, error: new Error(errorMessage) })
    const mockOrder = jest.fn().mockReturnThis()
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    })

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.isError).toBeTruthy()
    expect(result.current.error?.message).toBe(errorMessage)
    expect(result.current.data).toBeUndefined()
  })
})

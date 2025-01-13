import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { supabase } from '../../integrations/supabase/client'
import { Session, User } from '@supabase/supabase-js'

jest.mock('../../integrations/supabase/client', () => ({
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signOut: jest.fn()
  }
}))

describe('useAuth', () => {
  const mockSession = {
    user: {
      id: '123',
      email: 'test@example.com'
    }
  } as Session

  beforeEach(() => {
    jest.clearAllMocks()
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession }
    })
    ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession)
      return { subscription: { unsubscribe: jest.fn() } }
    })
  })

  it('should initialize with session and user', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await Promise.resolve() // Wait for async operations
    })

    expect(result.current.session).toEqual(mockSession)
    expect(result.current.user).toEqual(mockSession.user)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle sign out', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(result.current.session).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle auth state changes', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      // Trigger auth state change
      const callback = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0]
      callback('SIGNED_OUT', null)
    })

    expect(result.current.session).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})

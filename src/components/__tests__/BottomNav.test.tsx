import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BottomNav } from '../BottomNav'
import { supabase } from '@/integrations/supabase/client'

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({ data: { role: 'user' } })
        }))
      }))
    }))
  }
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="*" element={children} />
      </Routes>
    </QueryClientProvider>
  </MemoryRouter>
)

describe('BottomNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all navigation links', async () => {
    render(<BottomNav />, { wrapper })

    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Saved')).toBeTruthy()
    expect(screen.getByText('Profile')).toBeTruthy()
  })

  it('applies correct styling for active and inactive links', async () => {
    const { container } = render(
      <BottomNav />,
      { wrapper }
    )

    // Check if Home link is active by default
    const homeLink = container.querySelector('a[href="/"]')
    expect(homeLink?.className).toContain('text-red-500')

    // Check if other links are inactive
    const savedLink = container.querySelector('a[href="/saved"]')
    expect(savedLink?.className).toContain('text-gray-400')
    const profileLink = container.querySelector('a[href="/profile"]')
    expect(profileLink?.className).toContain('text-gray-400')
  })

  it('conditionally renders the admin link based on user role', async () => {
    // Mock admin user
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({ data: { role: 'admin' } })
        }))
      }))
    }))

    render(<BottomNav />, { wrapper })
    expect(screen.getByText('Admin')).toBeTruthy()

    // Mock non-admin user
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({ data: { role: 'user' } })
        }))
      }))
    }))
    render(<BottomNav />, { wrapper })
    expect(screen.queryByText('Admin')).toBeNull()
  })

  it('navigates to the correct page on link press', async () => {
    const { container } = render(<BottomNav />, { wrapper })

    const savedLink = container.querySelector('a[href="/saved"]')
    fireEvent.click(savedLink!)
    expect(window.location.pathname).toBe('/saved')

    const profileLink = container.querySelector('a[href="/profile"]')
    fireEvent.click(profileLink!)
    expect(window.location.pathname).toBe('/profile')
  })
})

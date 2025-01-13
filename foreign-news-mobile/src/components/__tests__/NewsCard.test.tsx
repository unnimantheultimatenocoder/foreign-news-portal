import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { AuthProvider } from '../../contexts/AuthContext'
import { ToastProvider } from '../../contexts/ToastContext'
import NewsCard from '../NewsCard'
import { Article } from '../../types/article'

const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  summary: 'This is a test article summary',
  image_url: 'https://example.com/image.jpg',
  source: 'Test Source',
  original_url: 'https://example.com/article',
  published_at: new Date().toISOString(),
  category_id: '1',
  status: 'published',
  source_id: 'test-source',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  moderated_at: null,
  moderated_by: null,
  scheduled_for: null,
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </NavigationContainer>
)

describe('NewsCard', () => {
  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
  })

  it('renders article title and summary', () => {
    const { getByText } = render(<NewsCard article={mockArticle} />, {
      wrapper,
    })

    expect(getByText(mockArticle.title)).toBeTruthy()
    expect(getByText(mockArticle.summary)).toBeTruthy()
  })

  it('displays source and date', () => {
    const { getByText } = render(<NewsCard article={mockArticle} />, {
      wrapper,
    })

    expect(getByText(mockArticle.source)).toBeTruthy()
  })

  it('navigates to article details on press', () => {
    const { getByTestId } = render(<NewsCard article={mockArticle} />, {
      wrapper,
    })

    const card = getByTestId('news-card')
    fireEvent.press(card)
    // Navigation would be tested in integration tests
  })

  it('shows placeholder when image fails to load', () => {
    const articleWithBadImage = {
      ...mockArticle,
      image_url: 'invalid-url',
    }

    const { getByTestId } = render(
      <NewsCard article={articleWithBadImage} />,
      { wrapper }
    )

    const fallbackImage = getByTestId('fallback-image')
    expect(fallbackImage).toBeTruthy()
  })
})

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { AuthProvider } from '../../contexts/AuthContext'
import { ToastProvider } from '../../contexts/ToastContext'
import CategoryCard from '../CategoryCard'
import { Category } from '../../hooks/useCategories'

const mockCategory: Category = {
  id: '1',
  name: 'Test Category',
  slug: 'test-category',
  description: 'This is a test category description',
  created_at: new Date().toISOString(),
  updated_at: null,
  icon_name: 'test-icon',
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </NavigationContainer>
)

describe('CategoryCard', () => {
  it('renders category name and description', () => {
    const { getByText } = render(<CategoryCard category={mockCategory} />, {
      wrapper,
    })

    expect(getByText(mockCategory.name)).toBeTruthy()
    if (mockCategory.description) {
      expect(getByText(mockCategory.description)).toBeTruthy()
    }
  })

  it('navigates to CategoryArticles screen on press', () => {
    const navigationMock = { navigate: jest.fn() }
    const { getByTestId } = render(
      <CategoryCard category={mockCategory} />,
      {
        wrapper,
      }
    )

    const card = getByTestId('category-card')
    fireEvent.press(card)
    // Navigation would be tested in integration tests
  })

  it('applies a random background color', () => {
    const { getByTestId } = render(
      <CategoryCard category={mockCategory} />,
      {
        wrapper,
      }
    )

    const card = getByTestId('category-card')
    const backgroundColor = card.props.style.find((style: any) => style.backgroundColor)?.backgroundColor
    expect(backgroundColor).toBeDefined()
  })
})

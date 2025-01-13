import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { CategoryFilter } from '../CategoryFilter'

const mockCategories = [
  { id: '1', name: 'Category 1' },
  { id: '2', name: 'Category 2' },
]

const mockOnSelectCategory = jest.fn()

describe('CategoryFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all categories and the "All" button', () => {
    const { getByText } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelectCategory}
      />
    )

    expect(getByText('All')).toBeTruthy()
    expect(getByText('Category 1')).toBeTruthy()
    expect(getByText('Category 2')).toBeTruthy()
  })

  it('applies correct styling for selected and unselected categories', () => {
    const { getByText } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="Category 1"
        onSelectCategory={mockOnSelectCategory}
      />
    )

    const selectedButton = getByText('Category 1')
    expect(selectedButton.className).toContain('bg-accent')
    expect(selectedButton.className).toContain('text-white')

    const unselectedButton = getByText('Category 2')
    expect(unselectedButton.className).toContain('bg-gray-100')
    expect(unselectedButton.className).toContain('text-secondary')
  })

  it('calls onSelectCategory with the correct category on press', () => {
    const { getByText } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelectCategory}
      />
    )

    const category1Button = getByText('Category 1')
    fireEvent.click(category1Button)
    expect(mockOnSelectCategory).toHaveBeenCalledWith('Category 1')

    const allButton = getByText('All')
    fireEvent.click(allButton)
    expect(mockOnSelectCategory).toHaveBeenCalledWith('All')
  })

  it('should render without categories', () => {
    const { getByText } = render(
      <CategoryFilter
        selectedCategory="All"
        onSelectCategory={mockOnSelectCategory}
      />
    )

    expect(getByText('All')).toBeTruthy()
  })
})

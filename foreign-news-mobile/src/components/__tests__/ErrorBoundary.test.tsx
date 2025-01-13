import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { ErrorBoundary } from '../ErrorBoundary'

const ErrorComponent = () => {
  throw new Error('Test error')
  return null
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders error message when child component throws error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Something went wrong')).toBeTruthy()
    expect(screen.getByText('Test error')).toBeTruthy()
    expect(screen.getByText('Try Again')).toBeTruthy()
  })

  it('calls componentDidCatch with error info', () => {
    const spy = jest.spyOn(ErrorBoundary.prototype, 'componentDidCatch')
    
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(spy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.stringContaining('ErrorComponent')
      })
    )
  })

  it('resets error state when Try Again is pressed', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    const tryAgainButton = getByText('Try Again')
    fireEvent.press(tryAgainButton)

    expect(screen.queryByText('Oops! Something went wrong')).toBeNull()
  })
})

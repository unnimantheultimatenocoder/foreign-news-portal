import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { Toast } from '../Toast'

const mockOnHide = jest.fn()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the message', () => {
    const message = 'Test toast message'
    const { getByText } = render(
      <Toast message={message} onHide={mockOnHide} />,
      { wrapper }
    )
    expect(getByText(message)).toBeTruthy()
  })

  it('applies correct background color based on type', () => {
    const { getByTestId } = render(
      <Toast message="Test" type="success" onHide={mockOnHide} />,
      { wrapper }
    )
    const successToast = getByTestId('toast-container')
    expect(successToast.props.style.backgroundColor).toBe('#4caf50')

    const { rerender } = render(
      <Toast message="Test" type="error" onHide={mockOnHide} />,
      { wrapper }
    )
    const errorToast = getByTestId('toast-container')
    expect(errorToast.props.style.backgroundColor).toBe('#FF3B30')

    rerender(<Toast message="Test" type="info" onHide={mockOnHide} />)
    const infoToast = getByTestId('toast-container')
    expect(infoToast.props.style.backgroundColor).toBe('#007AFF')
  })

  it('calls onHide after the duration', async () => {
    const duration = 2000
    render(
      <Toast message="Test" duration={duration} onHide={mockOnHide} />,
      { wrapper }
    )

    act(() => {
      jest.advanceTimersByTime(duration)
    })

    expect(mockOnHide).toHaveBeenCalled()
  })

  it('hides the toast when close button is pressed', async () => {
    const { getByText } = render(
      <Toast message="Test" onHide={mockOnHide} />,
      { wrapper }
    )

    const closeButton = getByText('✕')
    fireEvent.press(closeButton)

    expect(mockOnHide).toHaveBeenCalled()
  })
})

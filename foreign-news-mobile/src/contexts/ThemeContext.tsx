import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeColors {
  background: string
  surface: string
  text: string
  textSecondary: string
  primary: string
  secondary: string
  error: string
  border: string
}

export const lightTheme: ThemeColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#007AFF',
  secondary: '#5856D6',
  error: '#dc3545',
  border: '#e1e1e1',
}

export const darkTheme: ThemeColors = {
  background: '#1a1a1a',
  surface: '#2c2c2c',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  error: '#ff453a',
  border: '#404040',
}

interface ThemeContextType {
  theme: ThemeColors
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = '@theme_mode'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    loadSavedTheme()
  }, [])

  const loadSavedTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (savedMode) {
        setMode(savedMode as ThemeMode)
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const handleSetMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode)
      setMode(newMode)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const isDark =
    mode === 'system'
      ? systemColorScheme === 'dark'
      : mode === 'dark'

  const theme = isDark ? darkTheme : lightTheme

  const value = {
    theme,
    mode,
    setMode: handleSetMode,
    isDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

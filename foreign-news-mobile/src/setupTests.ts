import '@testing-library/jest-native/extend-expect'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')

  // Mock any specific Reanimated functions you use
  Reanimated.default.call = () => {}

  return Reanimated
})

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View')
  return {
    State: {},
    PanGestureHandler: View,
    BaseButton: View,
    Directions: {},
  }
})

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn().mockReturnValue([true, null]),
}))

// Mock react-navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      session: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}))

// Add jsdom environment
beforeAll(() => {
  Object.defineProperty(global, 'document', {
    value: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    writable: true,
  })
})

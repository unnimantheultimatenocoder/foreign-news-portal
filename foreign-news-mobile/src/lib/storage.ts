import AsyncStorage from '@react-native-async-storage/async-storage'
import { Article } from '../types/article'

const STORAGE_KEYS = {
  ARTICLES: 'articles',
  SAVED_ARTICLES: 'saved_articles',
  USER_PREFERENCES: 'user_preferences',
  AUTH_TOKEN: 'auth_token',
} as const

export async function cacheArticles(articles: Article[]) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ARTICLES,
      JSON.stringify(articles)
    )
  } catch (error) {
    console.error('Error caching articles:', error)
  }
}

export async function getCachedArticles(): Promise<Article[]> {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES)
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.error('Error getting cached articles:', error)
    return []
  }
}

export async function cacheSavedArticles(articles: Article[]) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVED_ARTICLES,
      JSON.stringify(articles)
    )
  } catch (error) {
    console.error('Error caching saved articles:', error)
  }
}

export async function getCachedSavedArticles(): Promise<Article[]> {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES)
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.error('Error getting cached saved articles:', error)
    return []
  }
}

export interface UserPreferences {
  darkMode: boolean
  notificationsEnabled: boolean
  fontSize: 'small' | 'medium' | 'large'
  language: string
}

export async function saveUserPreferences(preferences: UserPreferences) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    )
  } catch (error) {
    console.error('Error saving user preferences:', error)
  }
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    return preferences ? JSON.parse(preferences) : null
  } catch (error) {
    console.error('Error getting user preferences:', error)
    return null
  }
}

export async function clearStorage() {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS))
  } catch (error) {
    console.error('Error clearing storage:', error)
  }
}

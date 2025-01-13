import { createClient } from '@supabase/supabase-js'
import { Database } from './types'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your app.config.ts')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Article } from '../types/article'
import { MMKV } from 'react-native-mmkv'
import { supabase } from '../integrations/supabase/client'

const storage = new MMKV()

type QueryKey = ['articles']
type QueryData = Article[]
type QueryError = Error

async function fetchArticles(): Promise<QueryData> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error

    // Cache articles in MMKV
    storage.set('articles', JSON.stringify(data))
    return data as Article[]
  } catch (error) {
    // If online fetch fails, return cached data from MMKV
    const cached = storage.getString('articles')
    return cached ? JSON.parse(cached) : []
  }
}

interface UseOfflineArticlesOptions {
  enabled?: boolean
  retry?: boolean | number
  retryDelay?: number
  refetchInterval?: number | false
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}

export function useOfflineArticles(
  options: UseOfflineArticlesOptions = {}
): UseQueryResult<QueryData, QueryError> {
  return useQuery<QueryData, QueryError, QueryData, QueryKey>({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: options.enabled,
    retry: options.retry,
    retryDelay: options.retryDelay,
    refetchInterval: options.refetchInterval,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    refetchOnReconnect: options.refetchOnReconnect,
  })
}

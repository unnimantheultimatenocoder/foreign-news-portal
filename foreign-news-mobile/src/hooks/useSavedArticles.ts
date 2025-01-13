import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Article } from '../types/article'
import { getCachedSavedArticles, cacheSavedArticles } from '../lib/storage'
import { supabase } from '../integrations/supabase/client'

type QueryKey = ['savedArticles', string | undefined]

async function fetchSavedArticles(userId: string | undefined): Promise<Article[]> {
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*, articles(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const articles = data.map((item: any) => ({
      ...item.articles,
      saved_at: item.created_at,
      progress: item.progress,
    }))

    await cacheSavedArticles(articles)
    return articles
  } catch (error) {
    // If online fetch fails, return cached data
    return getCachedSavedArticles()
  }
}

interface UseSavedArticlesOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}

export function useSavedArticles(
  userId: string | undefined,
  options: UseSavedArticlesOptions = {}
): UseQueryResult<Article[], Error> {
  return useQuery({
    queryKey: ['savedArticles', userId],
    queryFn: () => fetchSavedArticles(userId),
    enabled: !!userId && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    refetchOnReconnect: options.refetchOnReconnect,
  })
}

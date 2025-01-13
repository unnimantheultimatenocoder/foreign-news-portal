import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import { Article } from '../types/article'

async function fetchCategoryArticles(categoryId: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category_id', categoryId)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching category articles:', error)
    return []
  }
}

interface UseCategoryArticlesOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}

export function useCategoryArticles(
  categoryId: string,
  options: UseCategoryArticlesOptions = {}
): UseQueryResult<Article[], Error> {
  return useQuery({
    queryKey: ['categoryArticles', categoryId],
    queryFn: () => fetchCategoryArticles(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    ...options,
  })
}

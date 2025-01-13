import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import { Article } from '../types/article'

interface UseSearchOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}

export function useSearch(
  searchTerm: string,
  options: UseSearchOptions = {}
): UseQueryResult<Article[], Error> {
  return useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return []

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return data as Article[]
    },
    enabled: searchTerm.trim().length > 0 && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    ...options,
  })
}

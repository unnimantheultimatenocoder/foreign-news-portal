import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string | null
  icon_name?: string
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

interface UseCategoriesOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}

export function useCategories(
  options: UseCategoriesOptions = {}
): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    ...options,
  })
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import { Article } from '../types/article'

async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data as Article[]
}

async function fetchArticle(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Article
}

async function fetchSavedArticles(userId: string) {
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*, articles(*)')
    .eq('user_id', userId)

  if (error) throw error
  return data.map((item) => ({
    ...item.articles,
    saved_at: item.created_at,
  })) as Article[]
}

export function useArticles(
  options?: Omit<
    UseQueryOptions<Article[], Error, Article[], ['articles']>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    ...options,
  })
}

export function useArticle(
  id: string,
  options?: Omit<
    UseQueryOptions<Article, Error, Article, ['article', string]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id),
    ...options,
  })
}

export function useSavedArticles(
  userId: string,
  options?: Omit<
    UseQueryOptions<Article[], Error, Article[], ['savedArticles', string]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['savedArticles', userId],
    queryFn: () => fetchSavedArticles(userId),
    ...options,
  })
}

import { supabase } from "@/integrations/supabase/client";
import type { Article, Category } from "./types";

export const getArticles = async ({
  page = 1,
  limit = 10,
  category,
  search,
  saved,
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  saved?: boolean;
}) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .order('published_at', { ascending: false });

  if (saved) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: savedArticles } = await supabase
        .from('saved_articles')
        .select('article_id')
        .eq('user_id', user.id);

      if (savedArticles) {
        const articleIds = savedArticles.map(sa => sa.article_id);
        query = query.in('id', articleIds);
      }
    }
  }

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data as (Article & { category: Category })[];
};

export const getTrendingArticles = async (limit = 5) => {
  // First, get the count of saves for each article
  const { data: saveCounts, error: saveCountError } = await supabase
    .from('saved_articles')
    .select('article_id, count', {
      count: 'exact',
      head: false
    })
    .select('article_id');

  if (saveCountError) throw saveCountError;

  // Create a map of article_id to save count
  const saveCountMap = new Map<string, number>();
  if (saveCounts) {
    saveCounts.forEach(item => {
      const currentCount = saveCountMap.get(item.article_id) || 0;
      saveCountMap.set(item.article_id, currentCount + 1);
    });
  }

  // Get articles with their categories
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .limit(limit);

  if (articlesError) throw articlesError;

  // Combine the data
  const articlesWithSaves = (articles || []).map(article => ({
    ...article,
    saves_count: saveCountMap.get(article.id) || 0
  }));

  // Sort by save count
  articlesWithSaves.sort((a, b) => {
    const countA = typeof a.saves_count === 'number' ? a.saves_count : 0;
    const countB = typeof b.saves_count === 'number' ? b.saves_count : 0;
    return countB - countA;
  });

  return articlesWithSaves as (Article & { category: Category; saves_count: number })[];
};

export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Article & { category: Category };
};

export const saveArticle = async (articleId: string) => {
  const { data, error } = await supabase
    .from('saved_articles')
    .insert([{ article_id: articleId }]);

  if (error) throw error;
  return data;
};
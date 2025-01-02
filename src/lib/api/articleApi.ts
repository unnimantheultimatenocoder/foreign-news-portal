import { supabase } from "@/integrations/supabase/client";
import type { Article, Category } from "./types";

export const getArticles = async ({
  page = 1,
  limit = 10,
  category,
  search,
  saved,
  preferences = false,
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  saved?: boolean;
  preferences?: boolean;
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

  if (preferences) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userPreferences } = await supabase
        .from('user_category_preferences')
        .select('category_id')
        .eq('user_id', user.id);

      if (userPreferences && userPreferences.length > 0) {
        const categoryIds = userPreferences.map(up => up.category_id);
        query = query.in('category_id', categoryIds);
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

export const getTrendingArticles = async (type: 'trending' | 'editors' | 'shared' = 'trending', limit = 5) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      saves_count:saved_articles(count),
      shares_count:article_shares(count)
    `);

  switch (type) {
    case 'editors':
      query = query.eq('is_editors_pick', true);
      break;
    case 'shared':
      query = query.order('shares_count', { ascending: false });
      break;
    case 'trending':
    default:
      // Combine saves and shares for trending score
      const { data: metrics } = await supabase
        .from('article_metrics')
        .select('*')
        .order('trending_score', { ascending: false });
      
      if (metrics && metrics.length > 0) {
        const articleIds = metrics.map(m => m.article_id);
        query = query.in('id', articleIds);
      }
      break;
  }

  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return data as (Article & { 
    category: Category; 
    saves_count: number;
    shares_count: number;
    trending_score?: number;
  })[];
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

export const getSimilarArticles = async (articleId: string, limit = 3) => {
  const article = await getArticleById(articleId);
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', article.category_id)
    .neq('id', articleId)
    .limit(limit);

  if (error) throw error;
  return data as (Article & { category: Category })[];
};
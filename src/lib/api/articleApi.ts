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
      saves:saved_articles(count),
      shares:saved_articles(count)
    `);

  switch (type) {
    case 'editors':
      query = query.eq('is_editors_pick', true);
      break;
    case 'shared':
      // Get articles with the most saves (since we don't track shares separately)
      query = query.order('saves', { foreignTable: 'saved_articles', ascending: false });
      break;
    case 'trending':
    default:
      // Get articles with the highest number of saves
      query = query.order('saves', { foreignTable: 'saved_articles', ascending: false });
      break;
  }

  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  // Transform the data to match the expected type
  const transformedData = data?.map(article => {
    const savesCount = Array.isArray(article.saves) ? article.saves.length : 0;
    const sharesCount = Array.isArray(article.shares) ? article.shares.length : 0;
    
    return {
      ...article,
      saves_count: savesCount,
      shares_count: sharesCount,
      trending_score: savesCount + sharesCount
    };
  }) || [];

  return transformedData as (Article & { 
    category: Category; 
    saves_count: number;
    shares_count: number;
    trending_score: number;
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
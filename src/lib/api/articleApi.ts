import { supabase } from "@/integrations/supabase/client";
import type { Article, Category } from "./types";
import { AppError } from "../errors";

const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove any trailing colons and clean up the URL
    let sanitized = url.trim()
      .replace(/:[/]*$/, '') // Remove trailing colons and slashes
      .replace(/([^:])\/+/g, '$1/'); // Remove duplicate slashes except after protocol
    
    // Ensure proper protocol
    if (!sanitized.match(/^https?:\/\//i)) {
      sanitized = `https://${sanitized}`;
    }
    
    // Validate URL format
    const urlObject = new URL(sanitized);
    return urlObject.toString();
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return '';
  }
};

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
  try {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
      .order('published_at', { ascending: false });

    if (saved) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { articles: [], hasMore: false, nextPage: undefined };
      }
      
      try {
        const { data: savedArticles, error } = await supabase
          .from('saved_articles')
          .select('article_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching saved articles:', error);
          return { articles: [], hasMore: false, nextPage: undefined };
        }

        if (!savedArticles || savedArticles.length === 0) {
          return { articles: [], hasMore: false, nextPage: undefined };
        }

        const articleIds = savedArticles.map(sa => sa.article_id);
        query = query.in('id', articleIds);
      } catch (error) {
        console.error('Error in saved articles query:', error);
        return { articles: [], hasMore: false, nextPage: undefined };
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

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) {
      throw new AppError('Error fetching articles', 'FETCH_ERROR', { supabaseError: error });
    }

    // Process and sanitize URLs in the response
    const processedData = data?.map(article => ({
      ...article,
      original_url: article.original_url ? sanitizeUrl(article.original_url) : null,
      image_url: article.image_url ? sanitizeUrl(article.image_url) : null,
    }));

    return {
      articles: (processedData as (Article & { category: Category })[]) || [],
      hasMore: (data?.length || 0) === limit,
      nextPage: (data?.length || 0) === limit ? page + 1 : undefined
    };
  } catch (error) {
    console.error('Error in getArticles:', error);
    throw error; // Let the error handler deal with it
  }
};

export const getTrendingArticles = async (type: 'trending' | 'editors' | 'shared' = 'trending', limit = 5) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      saves:saved_articles(id),
      shares:saved_articles(id)
    `);

  // First get the data without ordering to calculate trending scores
  const { data: rawData, error } = await query;
  if (error) throw error;

  // Calculate trending scores and sort the data in memory
  const articlesWithScores = rawData?.map(article => {
    const savesCount = Array.isArray(article.saves) ? article.saves.length : 0;
    const sharesCount = Array.isArray(article.shares) ? article.shares.length : 0;
    
    return {
      ...article,
      saves_count: savesCount,
      shares_count: sharesCount,
      trending_score: savesCount + sharesCount
    };
  }) || [];

  // Sort the data based on the type
  let sortedData = [...articlesWithScores];
  switch (type) {
    case 'editors':
      // For editors' picks, we would need to add an is_editors_pick column
      // For now, just return the most saved articles
      sortedData.sort((a, b) => b.saves_count - a.saves_count);
      break;
    case 'shared':
      sortedData.sort((a, b) => b.shares_count - a.shares_count);
      break;
    case 'trending':
    default:
      sortedData.sort((a, b) => b.trending_score - a.trending_score);
      break;
  }

  // Return only the requested number of articles
  return sortedData.slice(0, limit) as (Article & { 
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

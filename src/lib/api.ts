import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  summary: string;
  original_url: string;
  image_url: string | null;
  category_id: string;
  published_at: string;
  source: string;
  category?: Category;
  saves_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface UserPreferences {
  notification_settings: {
    email: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly' | 'realtime';
  };
  categories: string[];
}

// Articles API
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
    .select('article_id, count', { count: 'exact' })
    .group_by('article_id');

  if (saveCountError) throw saveCountError;

  // Create a map of article_id to save count
  const saveCountMap = new Map(
    saveCounts?.map(item => [item.article_id, parseInt(item.count as string)]) || []
  );

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
  const articlesWithSaves = articles?.map(article => ({
    ...article,
    saves_count: saveCountMap.get(article.id) || 0
  })) || [];

  // Sort by save count
  articlesWithSaves.sort((a, b) => (b.saves_count || 0) - (a.saves_count || 0));

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

// Categories API
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Category[];
};

// User Preferences API
export const getUserPreferences = async () => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('notification_settings')
    .maybeSingle();

  if (profileError) throw profileError;

  if (!profile) {
    // Return default preferences if no profile exists
    return {
      notification_settings: {
        email: false,
        push: false,
        frequency: 'daily',
      },
      categories: [],
    } as UserPreferences;
  }

  const { data: categories, error: categoriesError } = await supabase
    .from('user_category_preferences')
    .select('category_id');

  if (categoriesError) throw categoriesError;

  return {
    notification_settings: profile.notification_settings,
    categories: categories?.map(c => c.category_id) || [],
  } as UserPreferences;
};

export const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
  const updates = [];

  if (preferences.notification_settings) {
    updates.push(
      supabase
        .from('profiles')
        .update({ notification_settings: preferences.notification_settings })
        .single()
    );
  }

  if (preferences.categories) {
    // First delete existing preferences
    await supabase.from('user_category_preferences').delete().neq('category_id', '');
    
    // Then insert new ones
    updates.push(
      supabase.from('user_category_preferences').insert(
        preferences.categories.map(categoryId => ({
          category_id: categoryId,
        }))
      )
    );
  }

  await Promise.all(updates);
};
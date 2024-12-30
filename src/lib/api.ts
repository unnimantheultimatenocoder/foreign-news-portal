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
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (Article & { category: Category })[];
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
    .single();

  if (profileError) throw profileError;

  const { data: categories, error: categoriesError } = await supabase
    .from('user_category_preferences')
    .select('category_id');

  if (categoriesError) throw categoriesError;

  return {
    notification_settings: profile.notification_settings,
    categories: categories.map(c => c.category_id),
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
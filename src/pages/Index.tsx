import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getArticles, getUserPreferences, getCategories } from "@/lib/api";
import { NewsCard } from "@/components/NewsCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BottomNav } from "@/components/BottomNav";
import { useAppStore } from "@/stores/useAppStore";

const Index = () => {
  const { activeCategories, setPreferences } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Fetch user preferences with caching
  const { data: preferences } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Fetch categories with caching
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 60 * 60 * 1000, // Categories are relatively static, keep fresh for 1 hour
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  // Update preferences in store when they change
  useEffect(() => {
    if (preferences) {
      setPreferences(preferences);
    }
  }, [preferences, setPreferences]);

  // Fetch articles based on active categories with caching
  const { data: articles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles', { categories: activeCategories }],
    queryFn: () => getArticles({ category: activeCategories[0], limit: 20 }),
    staleTime: 2 * 60 * 1000, // Consider articles fresh for 2 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });

  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(error => {
          console.error('Service Worker registration failed:', error);
        });
      });
    }
  }, []);

  if (isArticlesLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">News Feed</h1>
        </div>
      </header>

      <CategoryFilter 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories || []}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles?.map((article) => (
            <NewsCard
              key={article.id}
              title={article.title}
              summary={article.summary}
              imageUrl={article.image_url || '/placeholder.svg'}
              category={article.category?.name || 'Uncategorized'}
              date={new Date(article.published_at).toLocaleDateString()}
              url={article.original_url}
            />
          ))}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
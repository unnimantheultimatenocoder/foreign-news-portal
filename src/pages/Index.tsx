import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getArticles, getUserPreferences } from "@/lib/api";
import { NewsCard } from "@/components/NewsCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BottomNav } from "@/components/BottomNav";
import { useAppStore } from "@/stores/useAppStore";

const Index = () => {
  const { activeCategories, setPreferences } = useAppStore();

  // Fetch user preferences
  const { data: preferences } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences,
  });

  // Update preferences in store when they change
  useEffect(() => {
    if (preferences) {
      setPreferences(preferences);
    }
  }, [preferences, setPreferences]);

  // Fetch articles based on active categories
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', { categories: activeCategories }],
    queryFn: () => getArticles({ category: activeCategories[0], limit: 20 }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-secondary">Loading articles...</p>
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

      <CategoryFilter />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles?.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
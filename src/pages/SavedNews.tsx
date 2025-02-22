import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";
import { BottomNav } from "@/components/BottomNav";
import { TopNav } from "@/components/TopNav";
import { getArticles } from "@/lib/api/articleApi";

const SavedNews = () => {
  const title = 'Saved Articles';
  const { data, isLoading } = useQuery({
    queryKey: ['savedArticles'],
    queryFn: async () => {
      const result = await getArticles({ saved: true });
      return result.articles;
    },
    staleTime: 1000,
    gcTime: 5000,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-secondary">Loading saved articles...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <TopNav title={title} />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-20">
            <p className="text-gray-500">You haven't saved any articles yet.</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <TopNav title={title} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data?.map((article) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <NewsCard
                  id={article.id}
                  title={article.title}
                  summary={article.summary}
                  imageUrl={article.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
                  category={article.category?.name || "Uncategorized"}
                  date={new Date(article.published_at).toLocaleDateString()}
                  url={article.original_url}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default SavedNews;

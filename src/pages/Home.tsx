import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PullToRefresh from "react-pull-to-refresh";
import { NewsCard } from "@/components/NewsCard";
import { BottomNav } from "@/components/BottomNav";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getArticles, getCategories } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useInView } from "react-intersection-observer";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    isLoading: articlesLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['articles', { category: selectedCategory }],
    queryFn: ({ pageParam = 1 }) => 
      getArticles({ 
        category: selectedCategory || undefined,
        page: pageParam,
        limit: ITEMS_PER_PAGE 
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined;
    },
  });

  const { data: categories } = useInfiniteQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Refreshed",
        description: "Latest articles loaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh articles",
        variant: "destructive",
      });
    }
  };

  if (articlesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-secondary">Loading articles...</p>
        </div>
      </div>
    );
  }

  const allArticles = data?.pages.flat() || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Global News</h1>
          {categories && (
            <CategoryFilter
              selectedCategory={selectedCategory || "All"}
              onSelectCategory={(category) => setSelectedCategory(category === "All" ? null : category)}
              categories={categories}
            />
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PullToRefresh onRefresh={handleRefresh}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allArticles.map((article) => (
              <NewsCard
                key={article.id}
                id={article.id}
                title={article.title}
                summary={article.summary}
                imageUrl={article.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
                category={article.category?.name || "Uncategorized"}
                date={new Date(article.published_at).toLocaleDateString()}
                url={article.original_url}
              />
            ))}
          </motion.div>
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          )}
        </PullToRefresh>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
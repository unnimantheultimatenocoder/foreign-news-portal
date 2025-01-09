import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import PullToRefresh from "react-pull-to-refresh";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import { BottomNav } from "@/components/BottomNav";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getArticles } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "react-intersection-observer";
import { useIsMobile } from "@/hooks/use-mobile";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  const { ref: loadMoreRef, inView } = useInView();
  const isMobile = useIsMobile();

  const {
    data,
    isLoading: articlesLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['articles', { category: selectedCategory }],
    queryFn: ({ pageParam = 1 }) => getArticles({
      category: selectedCategory || undefined,
      page: pageParam,
      limit: ITEMS_PER_PAGE,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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

  const allArticles = data?.pages.flatMap(page => page.articles) || [];

  const handleNext = () => {
    if (currentIndex < allArticles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (articlesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="mt-4 text-secondary">Loading articles...</p>
        </div>
      </div>
    );
  }

  const formatArticleForNewsCard = (article: any) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    imageUrl: article.image_url,
    category: article.category?.name || article.source,
    date: new Date(article.published_at).toLocaleDateString(),
    url: article.original_url,
  });

  return (
    <div className="min-h-screen bg-background dark:bg-[#121620] pb-16">
      <header className="bg-background dark:bg-[#1A1F2C] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-foreground">Global News</h1>
          <CategoryFilter
            selectedCategory={selectedCategory || "All"}
            onSelectCategory={(category) =>
              setSelectedCategory(category === "All" ? null : category)
            }
            categories={[]}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <PullToRefresh onRefresh={handleRefresh}>
          {isMobile ? (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="w-full"
                >
                  {allArticles[currentIndex] && (
                    <NewsCard
                      key={allArticles[currentIndex].id}
                      {...formatArticleForNewsCard(allArticles[currentIndex])}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="p-2 bg-background dark:bg-[#1A1F2C] rounded-full shadow-md disabled:opacity-50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === allArticles.length - 1}
                  className="p-2 bg-background dark:bg-[#1A1F2C] rounded-full shadow-md disabled:opacity-50"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {allArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  {...formatArticleForNewsCard(article)}
                />
              ))}
            </motion.div>
          )}
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
            </div>
          )}
        </PullToRefresh>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
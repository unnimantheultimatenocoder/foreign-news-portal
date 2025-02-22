import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import { BottomNav } from "@/components/BottomNav";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getArticles } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "react-intersection-observer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ReactElement } from 'react';
import { PullToRefresh } from "../components/PullToRefresh";

const ITEMS_PER_PAGE = 10;

interface Article {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  category?: { name: string };
  source?: string;
  published_at: string;
  original_url: string;
}

const formatArticleForNewsCard = (article: Article) => ({
  id: article.id,
  title: article.title,
  summary: article.summary,
  imageUrl: article.image_url,
  category: article.category?.name || article.source,
  date: new Date(article.published_at).toLocaleDateString(),
  url: article.original_url,
});

const Home = (): ReactElement => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All");
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
    queryKey: ['articles', { category: selectedCategoryId }],
    queryFn: ({ pageParam = 1 }) => getArticles({
      category: selectedCategoryId || undefined,
      page: pageParam,
      limit: ITEMS_PER_PAGE,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allArticles = data?.pages.flatMap(page => page.articles) || [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="mt-4 text-secondary">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="fixed top-0 left-0 right-0 z-[1000]">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-opacity-90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="w-full overflow-hidden flex items-center justify-between">
              <CategoryFilter
                selectedCategory={selectedCategoryName}
                onSelectCategory={(categoryId) => {
                  if (categoryId === "All") {
                    setSelectedCategoryId(null);
                    setSelectedCategoryName("All");
                  } else {
                    const selected = categories.find(c => c.id === categoryId);
                    if (selected) {
                      setSelectedCategoryId(categoryId);
                      setSelectedCategoryName(selected.name);
                    }
                  }
                }}
              />
              {isMobile && (
                <button
                  className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
                  onClick={handleRefresh}
                  aria-label="Refresh articles"
                >
                  <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-12 pb-6">
        {isMobile ? (
          <div
            className="relative h-[calc(100vh-160px)] overflow-hidden"
            aria-label="News feed with swipe navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="w-full absolute top-0 left-0"
                key={currentIndex}
                initial={{ opacity: 0, y: 300 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40
                  }
                }}
                exit={{
                  opacity: 0,
                  y: -300,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40
                  }
                }}
              >
                {allArticles[currentIndex] && (
                  <NewsCard
                    key={allArticles[currentIndex].id}
                    {...formatArticleForNewsCard(allArticles[currentIndex])}
                    onSwipe={(direction) => {
                      if (direction === 'up') {
                        handleNext();
                      } else if (direction === 'down') {
                        handlePrevious();
                      }
                    }}
                    aria-label={`Article ${currentIndex + 1} of ${allArticles.length}. Swipe up for next, down for previous`}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <PullToRefresh onRefresh={handleRefresh} disabled={articlesLoading}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              aria-label="News articles grid"
            >
              {allArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  {...formatArticleForNewsCard(article)}
                  aria-label={`Article: ${article.title}`}
                />
              ))}
              {hasNextPage && (
                <div 
                  ref={loadMoreRef} 
                  className="flex justify-center mt-8 col-span-full"
                  aria-label="Loading more articles"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                </div>
              )}
            </motion.div>
          </PullToRefresh>
        )}
      </main>

      <BottomNav onHomeClick={handleRefresh} />
    </div>
  );
};

export default Home;

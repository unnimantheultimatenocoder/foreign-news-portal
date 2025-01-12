import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api/types";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const allArticles = data?.pages.flatMap(page => page.articles) || [];

  // Preload adjacent articles
  useEffect(() => {
    if (allArticles.length > 0) {
      const preloadImages = () => {
        const preloadIndexes = [
          currentIndex - 1,
          currentIndex + 1
        ].filter(index => index >= 0 && index < allArticles.length);

        preloadIndexes.forEach(index => {
          const img = new Image();
          img.src = allArticles[index].image_url;
        });
      };
      preloadImages();
    }
  }, [currentIndex, allArticles]);

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
    <div className="min-h-screen bg-background dark:bg-[#121620] pb-20 relative">
          {/* Fixed Header Layer */}
          <div className="fixed top-0 left-0 right-0 z-[1000] will-change-transform">
            <header className="bg-background dark:bg-[#1A1F2C] border-b border-gray-200 dark:border-gray-800">
              <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
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
                <h1 className="text-2xl font-bold text-foreground font-sans tracking-wide mx-auto" style={{ transform: 'translateZ(0)' }}>
                  AroundTheGlobe
                </h1>
              </div>
            </header>
          </div>

<main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        <PullToRefresh onRefresh={handleRefresh}>
      {isMobile ? (
            <div className="relative h-[calc(100vh-160px)] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0, transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.5,
                    velocity: 0.5
                  } }}
                  exit={{ opacity: 0, x: -300, transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.5,
                    velocity: 0.5
                  } }}
                  className="w-full absolute top-0 left-0"
                  style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
                >
                  {allArticles[currentIndex] && (
                    <NewsCard
                      key={allArticles[currentIndex].id}
                      {...formatArticleForNewsCard(allArticles[currentIndex])}
                      onSwipe={(direction) => {
                        if (direction === 'left') {
                          handleNext();
                        } else if (direction === 'right') {
                          handlePrevious();
                        }
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mb-4" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
            <div ref={loadMoreRef} className="flex justify-center mt-8">
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

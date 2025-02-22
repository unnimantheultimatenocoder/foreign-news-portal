import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { getArticles } from "@/lib/api";
import { NewsCard } from "@/components/NewsCard";
import { CategoryCard } from "@/components/CategoryCard";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 20;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { ref: loadMoreRef, inView } = useInView();
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const { toast } = useToast();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getArticles({
        search: searchQuery,
        limit: ITEMS_PER_PAGE,
        page: pageParam,
      });
      return {
        articles: result.articles,
        nextPage: result.hasMore ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const articles = data?.pages.flatMap(page => page.articles) || [];

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && currentArticleIndex > 0) {
      setCurrentArticleIndex(prev => prev - 1);
      toast({
        title: "Previous Article",
        description: "Showing the previous article",
      });
    } else if (direction === "left" && currentArticleIndex < articles.length - 1) {
      setCurrentArticleIndex(prev => prev + 1);
      toast({
        title: "Next Article",
        description: "Showing the next article",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 pt-4 sm:pt-8 pb-16 sm:pb-20">
        <div className="space-y-4 sm:space-y-6 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Explore
          </h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 dark:text-dark-muted" />
            <Input
              type="search"
              placeholder="Search for topics..."
              className="pl-10 search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CategoryCard type="global" title="Global News" />
            <CategoryCard type="jobs" title="Jobs" />
            <CategoryCard type="education" title="Education" />
            <CategoryCard type="immigration" title="Immigration" />
            <CategoryCard type="tech" title="Tech Updates" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[400px] bg-card dark:bg-dark-card animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="relative h-[calc(100vh-16rem)] sm:h-[calc(100vh-20rem)] overflow-hidden">
              <AnimatePresence mode="wait">
                {articles[currentArticleIndex] && (
                  <motion.div
                    key={articles[currentArticleIndex].id}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <NewsCard
                      id={articles[currentArticleIndex].id}
                      title={articles[currentArticleIndex].title}
                      summary={articles[currentArticleIndex].summary}
                      imageUrl={articles[currentArticleIndex].image_url || '/placeholder.svg'}
                      category={articles[currentArticleIndex].category?.name || 'Uncategorized'}
                      date={new Date(articles[currentArticleIndex].published_at).toLocaleDateString()}
                      url={articles[currentArticleIndex].original_url}
                      onSwipe={handleSwipe}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dark-text" />
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;
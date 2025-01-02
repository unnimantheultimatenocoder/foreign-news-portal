import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTrendingArticles } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const TrendingArticles = () => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const { data: trendingArticles, isLoading } = useQuery({
    queryKey: ['trending-articles'],
    queryFn: () => getTrendingArticles(),
  });

  const handleShare = async (article: { title: string; original_url: string }) => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: article.original_url,
        });
        toast({
          title: 'Shared successfully',
          description: 'The article has been shared.',
        });
      } else {
        await navigator.clipboard.writeText(article.original_url);
        toast({
          title: 'Link copied',
          description: 'The article link has been copied to your clipboard.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share the article.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Trending Articles</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Trending Articles</h2>
      <div className="space-y-3">
        {trendingArticles?.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-secondary mt-1">
                    {article.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSharing}
                  onClick={() => handleShare(article)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
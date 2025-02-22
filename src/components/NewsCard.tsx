import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { NewsCardImage } from "./news/NewsCardImage";
import { NewsCardContent } from "./news/NewsCardContent";
import { NewsCardActions } from "./news/NewsCardActions";
import { Share2 } from "lucide-react";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useSaveArticle } from "@/hooks/use-save-article";
import { useIsMobile } from "@/hooks/use-mobile";
import { useArticleHistory } from "@/hooks/use-article-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
  url: string;
  showDelete?: boolean;
  onDelete?: () => void;
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
}

const areEqual = (prevProps: NewsCardProps, nextProps: NewsCardProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.summary === nextProps.summary &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.category === nextProps.category &&
    prevProps.date === nextProps.date &&
    prevProps.url === nextProps.url &&
    prevProps.showDelete === nextProps.showDelete
  );
};

export const NewsCard: React.FC<NewsCardProps> = React.memo(({ id, title, summary, imageUrl, category, date, url, showDelete = false, onDelete, onSwipe }) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const { markAsRead, isArticleRead } = useArticleHistory();
  const isRead = isArticleRead(id);

  useEffect(() => {
    // Mark article as read when it's expanded or when read more is clicked
    if (expanded) {
      markAsRead(id);
    }
  }, [expanded, id, markAsRead]);
  
  const { controls, handleDragEnd } = useSwipeGesture({ onSwipe, isMobile });
  const { isSaved, handleSave } = useSaveArticle(id);
  const { toast } = useToast();

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy') => {
    const shareText = encodeURIComponent(`Check out this article: ${title}`);
    const baseUrl = window.location.origin;
    const shareUrl = encodeURIComponent(
      id
        ? `${baseUrl}/${id}`
        : baseUrl
    );

    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${shareText}%0A%0A${shareUrl}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(
            id
              ? `${window.location.origin}/${id}`
              : window.location.origin
          );
          toast({
            title: "Link copied",
            description: "The article link has been copied to your clipboard",
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share article",
        variant: "destructive",
      });
    }
  };

  const handleReadMore = useCallback(() => {
    if (url) {
      markAsRead(id);
      const properUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(properUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Error",
        description: "Article URL is not available",
        variant: "destructive"
      });
    }
  }, [url, toast]);
  const motionProps = useMemo(() => ({
    drag: isMobile ? "y" as const : "x" as const,
    dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
    dragElastic: 0.9,
    onDragEnd: handleDragEnd,
    animate: controls,
    initial: isMobile ? { y: 0 } : { x: 0 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.6,
      velocity: 2.5
    },
    className: `flex flex-col h-full overflow-y-auto bg-white dark:bg-[#1A1F2C] text-[#000000] dark:text-foreground rounded-xl border ${isRead ? 'border-gray-300 dark:border-gray-700/50' : 'border-gray-200 dark:border-gray-800/50'} shadow-sm hover:shadow-lg transition-all duration-300 relative z-10 gpu-accelerated ${isRead ? 'opacity-80' : 'opacity-100'}`,
    style: {
      touchAction: "none" as const,
      willChange: "transform" as const,
      perspective: "1000px" as const,
      backfaceVisibility: "hidden" as const,
      transform: "translate3d(0,0,0)" as const,
      WebkitFontSmoothing: "antialiased" as const,
      WebkitTransform: "translate3d(0,0,0)" as const,
      WebkitBackfaceVisibility: "hidden" as const
    }
  }), [isMobile, handleDragEnd, controls]);
  return (
    <motion.div {...motionProps}>
      <NewsCardImage imageUrl={imageUrl} title={title} />
      
      <div className="flex flex-col flex-grow p-3 sm:p-4 space-y-2.5">
        <NewsCardContent
          title={title}
          summary={summary}
          source={category}
          date={date}
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />
        
        <NewsCardActions
          onShare={handleShare}
          onSave={handleSave}
          onDelete={onDelete}
          onReadMore={handleReadMore}
          isSaved={isSaved}
          showDelete={showDelete}
          title={title}
          id={id}
        />
      </div>
    </motion.div>
  );
}, areEqual);

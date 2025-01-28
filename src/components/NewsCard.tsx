import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { NewsCardImage } from "./news/NewsCardImage";
import { NewsCardContent } from "./news/NewsCardContent";
import { NewsCardActions } from "./news/NewsCardActions";
import { ShareMenu } from "./news/ShareMenu";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useSaveArticle } from "@/hooks/use-save-article";
import { useIsMobile } from "@/hooks/use-mobile";

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

export const NewsCard = ({
  id,
  title,
  summary,
  imageUrl,
  category,
  date,
  url,
  showDelete = false,
  onDelete,
  onSwipe
}: NewsCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const isMobile = useIsMobile();
  const { controls, handleDragEnd } = useSwipeGesture({ onSwipe, isMobile });
  const { isSaved, handleSave } = useSaveArticle(id);
  const { toast } = useToast();

  const handleShare = () => {
    setShowShareMenu(true);
  };

  const handleReadMore = () => {
    if (url) {
      const properUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(properUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Error",
        description: "Article URL is not available",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      drag={isMobile ? "y" : "x"}
      dragElastic={0.5}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={isMobile ? { y: 0 } : { x: 0 }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        mass: 0.8
      }}
      className="flex flex-col h-full overflow-y-auto bg-black dark:bg-[#1A1F2C] rounded-xl border border-gray-200 dark:border-gray-800/50 shadow-sm hover:shadow-lg transition-all duration-300 relative z-10"
      style={{
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
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
        />
      </div>
      
      {showShareMenu && (
        <ShareMenu
          newsCardId={id}
          title={title}
        />
      )}
    </motion.div>
  );
};

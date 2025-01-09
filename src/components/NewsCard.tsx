import { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsCardImage } from "./news/NewsCardImage";
import { NewsCardContent } from "./news/NewsCardContent";
import { NewsCardActions } from "./news/NewsCardActions";
import { ShareMenu } from "./news/ShareMenu";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
  onSwipe?: (direction: "left" | "right") => void;
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
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const controls = useAnimation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: savedArticles, error } = await supabase
            .from('saved_articles')
            .select('article_id')
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error('Error checking saved status:', error);
            return;
          }
          
          setIsSaved(savedArticles?.some(article => article.article_id === id) || false);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsSaved(false);
      }
    };
    
    checkSavedStatus();
  }, [id]);

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Login Required",
          description: "Please log in to save articles.",
          variant: "default"
        });
        navigate('/auth');
        return;
      }

      setIsSaved(!isSaved);
      
      try {
        if (isSaved) {
          await supabase
            .from('saved_articles')
            .delete()
            .eq('user_id', session.user.id)
            .eq('article_id', id);

          toast({
            title: "Removed from Saved Articles",
            description: "This article has been removed from your saved articles.",
          });
        } else {
          await supabase
            .from('saved_articles')
            .insert({ user_id: session.user.id, article_id: id });

          toast({
            title: "Saved Article",
            description: "This article has been saved to your articles.",
          });
        }

        queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
      } catch (error) {
        setIsSaved(!isSaved);
        toast({
          title: "Error",
          description: "Failed to update saved articles. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling save:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    setShowShareMenu(true);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
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

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    const direction = info.offset.x > 0 ? "right" : "left";
    
    if (Math.abs(info.offset.x) > swipeThreshold && onSwipe) {
      await controls.start({
        x: info.offset.x > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipe(direction);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: 0, opacity: 1 }}
      className="flex flex-col h-full overflow-hidden bg-white dark:bg-[#1A1F2C] rounded-xl border border-gray-200 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex-none">
        <NewsCardImage imageUrl={imageUrl} title={title} />
      </div>
      
      <div className="flex flex-col flex-grow">
        <NewsCardContent
          title={title}
          summary={summary}
          source={category}
          date={date}
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />
        
        <div className="mt-auto">
          <NewsCardActions
            onShare={handleShare}
            onSave={handleSave}
            onDelete={handleDelete}
            onReadMore={handleReadMore}
            isSaved={isSaved}
            showDelete={showDelete}
          />
        </div>
      </div>
      
      {showShareMenu && (
        <ShareMenu
          url={url}
          title={title}
        />
      )}
    </motion.div>
  );
};
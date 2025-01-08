import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  onDelete
}: NewsCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
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

      // Optimistically update the UI
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

        // Invalidate and refetch the saved articles query
        queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
      } catch (error) {
        // Revert optimistic update on error
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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="overflow-hidden bg-white dark:bg-[#1A1F2C] rounded-xl border border-gray-200 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-200 relative"
      style={{ 
        maxHeight: expanded ? '2000px' : '500px', // Increased max height when expanded
        transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother transition
        willChange: 'max-height', // Optimize performance
        overflowY: expanded ? 'visible' : 'hidden' // Allow content to be visible when expanded
      }}
    >
      <div className={`relative ${expanded ? 'z-10' : ''}`}>
        <NewsCardImage imageUrl={imageUrl} title={title} />
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
          onDelete={handleDelete}
          onReadMore={handleReadMore}
          isSaved={isSaved}
          showDelete={showDelete}
        />
        {showShareMenu && (
          <ShareMenu
            url={url}
            title={title}
          />
        )}
      </div>
    </motion.div>
  );
};
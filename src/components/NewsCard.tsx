import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsCardImage } from "./news/NewsCardImage";
import { NewsCardContent } from "./news/NewsCardContent";
import { NewsCardActions } from "./news/NewsCardActions";
import { ShareMenu } from "./news/ShareMenu";

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

  useEffect(() => {
    const checkSavedStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: savedArticles } = await supabase
          .from('saved_articles')
          .select('article_id')
          .eq('user_id', user.id);
        setIsSaved(savedArticles?.some(article => article.article_id === id));
      }
    };
    checkSavedStatus();
  }, [id]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (isSaved) {
        await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', id);
        setIsSaved(false);
        toast({
          title: "Removed from Saved Articles",
          description: "This article has been removed from your saved articles.",
        });
      } else {
        await supabase
          .from('saved_articles')
          .insert({ user_id: user.id, article_id: id });
        setIsSaved(true);
        toast({
          title: "Saved Article",
          description: "This article has been saved to your articles.",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "You need to be logged in to save articles.",
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
      className="overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
    >
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
    </motion.div>
  );
};
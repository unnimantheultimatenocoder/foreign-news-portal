import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsCardImage } from "./news/NewsCardImage";
import { NewsCardContent } from "./news/NewsCardContent";
import { NewsCardActions } from "./news/NewsCardActions";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
  url: string;
}

export const NewsCard = ({
  id,
  title,
  summary,
  imageUrl,
  category,
  date,
  url,
}: NewsCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "The article link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share the article.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to save articles",
          variant: "destructive",
        });
        return;
      }

      if (isSaved) {
        const { error } = await supabase
          .from('saved_articles')
          .delete()
          .match({ article_id: id, user_id: user.id });

        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Success",
          description: "Article removed from saved articles",
        });
      } else {
        const { error } = await supabase
          .from('saved_articles')
          .insert([{ article_id: id, user_id: user.id }]);

        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="overflow-hidden bg-card rounded-xl border shadow-sm"
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
        onReadMore={() => window.open(url, '_blank')}
        isSaved={isSaved}
      />
    </motion.div>
  );
};
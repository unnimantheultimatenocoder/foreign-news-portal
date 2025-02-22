import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const useSaveArticle = (articleId: string) => {
  const [isSaved, setIsSaved] = useState(false);
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
          
          setIsSaved(savedArticles?.some(article => article.article_id === articleId) || false);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsSaved(false);
      }
    };
    
    checkSavedStatus();
  }, [articleId]);

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
          const { error: deleteError } = await supabase
            .from('saved_articles')
            .delete()
            .eq('user_id', session.user.id)
            .eq('article_id', articleId);

          if (deleteError) {
            toast({
              title: "Error Removing Article",
              description: "Failed to remove from saved articles. Please try again.",
              variant: "destructive"
            });
            return;
          }

          toast({
            title: "Removed from Saved Articles",
            description: "This article has been removed from your saved articles.",
          });
        } else {
          const { error: insertError } = await supabase
            .from('saved_articles')
            .insert({ user_id: session.user.id, article_id: articleId })
            .select();

          if (insertError) {
            if (insertError.code === '23505') { // Unique constraint violation
              toast({
                title: "Already Saved",
                description: "This article is already in your saved articles",
              });
              return;
            }
            throw insertError;
          }

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

  return {
    isSaved,
    handleSave
  };
};

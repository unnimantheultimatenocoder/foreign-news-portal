import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateReadingTime } from "@/lib/utils";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
  url: string;
}

export const NewsCard = ({ id, title, summary, imageUrl, category, date, url }: NewsCardProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const readingTime = calculateReadingTime(summary);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: "50px",
      }
    );

    const element = document.querySelector(`[data-image-url="${imageUrl}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    const checkIfSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('saved_articles')
          .select('*')
          .eq('article_id', id)
          .eq('user_id', user.id)
          .single();
        setIsSaved(!!data);
      }
    };
    checkIfSaved();
  }, [id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        await supabase
          .from('saved_articles')
          .delete()
          .eq('article_id', id)
          .eq('user_id', user.id);
        setIsSaved(false);
        toast({
          title: "Success",
          description: "Article removed from saved articles",
        });
      } else {
        await supabase
          .from('saved_articles')
          .insert([
            { article_id: id, user_id: user.id }
          ]);
        setIsSaved(true);
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
      }
    } catch (error) {
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
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="overflow-hidden cursor-pointer group relative">
        <button
          onClick={handleSave}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Bookmark
            className={`w-4 h-4 ${isSaved ? 'fill-current text-accent' : 'text-gray-500'}`}
          />
        </button>
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-48 overflow-hidden" data-image-url={imageUrl}>
            {isIntersecting && (
              <img
                src={imageUrl}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } group-hover:scale-105`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary">{date}</span>
                <div className="flex items-center text-secondary">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{readingTime} min read</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-secondary line-clamp-3 text-sm">{summary}</p>
          </div>
        </a>
      </Card>
    </motion.div>
  );
};

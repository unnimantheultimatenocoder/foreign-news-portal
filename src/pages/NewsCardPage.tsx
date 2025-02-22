import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { getArticleById } from "@/lib/api/articleApi";

export const NewsCardPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id) {
          console.log('Fetching article with ID:', id);
          const data = await getArticleById(id);
          console.log('Article data received:', data);
          setArticle(data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, toast]);

  if (loading) {
    console.log('Article page is loading...');
    return <div>Loading...</div>;
  }

  if (!article) {
    console.log('Article not found or undefined');
    return <div>Article not found</div>;
  }

  console.log('Rendering article:', article);
  return (
    <div className="container mx-auto p-4">
      <NewsCard
        id={article.id}
        title={article.title}
        summary={article.summary}
        imageUrl={article.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
        category={article.category?.name || "Uncategorized"}
        date={new Date(article.published_at).toLocaleDateString()}
        url={article.original_url}
      />
    </div>
  );
};

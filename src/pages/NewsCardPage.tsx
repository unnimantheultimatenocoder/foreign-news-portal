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
          const data = await getArticleById(id);
          setArticle(data);
        }
      } catch (error) {
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
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <NewsCard
        id={article.id}
        title={article.title}
        summary={article.summary}
        imageUrl={article.imageUrl}
        category={article.category}
        date={article.date}
        url={article.url}
      />
    </div>
  );
};

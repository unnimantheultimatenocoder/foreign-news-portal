import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArticleTable } from "@/components/admin/ArticleTable";

export default function AdminArticles() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles', search],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:categories(name),
          moderator:profiles(id)
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('articles')
        .update({ 
          status: 'published',
          moderated_by: user.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: "Success",
        description: "Article published successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to publish article: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: "Success",
        description: "Article deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handlePublish = (articleId: string) => {
    publishMutation.mutate(articleId);
  };

  const handleDelete = (articleId: string) => {
    deleteMutation.mutate(articleId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles Management</h1>
        <Button onClick={() => navigate('/admin/articles/new')}>
          Add New Article
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <ArticleTable
        articles={articles}
        isLoading={isLoading}
        onPublish={handlePublish}
        onDelete={handleDelete}
      />
    </div>
  );
}
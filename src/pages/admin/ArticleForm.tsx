import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormFields } from "./components/ArticleFormFields";

interface ArticleFormData {
  title: string;
  summary: string;
  original_url: string;
  image_url?: string;
  category_id?: string;
  source: string;
  status: string;
}

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const form = useForm<ArticleFormData>({
    defaultValues: {
      title: "",
      summary: "",
      original_url: "",
      image_url: "",
      category_id: undefined,
      source: "manual",
      status: "draft",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        summary: article.summary,
        original_url: article.original_url,
        image_url: article.image_url || "",
        category_id: article.category_id,
        source: article.source,
        status: article.status,
      });
    }
  }, [article, form]);

  const mutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      if (isEditing && id) {
        const { data: result, error } = await supabase
          .from('articles')
          .update(data)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('articles')
          .insert([data])
          .select()
          .maybeSingle();

        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success",
        description: `Article ${isEditing ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin/articles');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    mutation.mutate(data);
  };

  if (isEditing && isArticleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Article' : 'Create New Article'}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ArticleFormFields control={form.control} categories={categories} />
          
          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {isEditing ? 'Update' : 'Create'} Article
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/articles')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
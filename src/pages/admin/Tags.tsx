import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Tags() {
  const { data: tags, isLoading } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_tags')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tag Management</h1>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : tags?.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{new Date(tag.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
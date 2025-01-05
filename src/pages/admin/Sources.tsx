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

export default function Sources() {
  const { data: sources, isLoading } = useQuery({
    queryKey: ['admin-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_sources')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Source Management</h1>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sources?.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell>{source.url}</TableCell>
                <TableCell>{source.type}</TableCell>
                <TableCell>{source.is_active ? 'Active' : 'Inactive'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminRoute = () => {
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log("Admin route check:", { user, profile }); // Debug log
      return profile?.role === 'admin';
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    console.log("Access denied: User is not admin"); // Debug log
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
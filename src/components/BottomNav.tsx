import { Link } from "react-router-dom";
import { Home, Search, BookmarkIcon, User, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BottomNav = () => {
  const { data: isAdmin } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return profile?.role === 'admin';
    }
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50">
      <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link to="/search" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <Search className="h-6 w-6" />
        <span className="text-xs mt-1">Search</span>
      </Link>
      
      <Link to="/saved" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <BookmarkIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Saved</span>
      </Link>
      
      <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-primary">
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>

      {isAdmin && (
        <Link to="/admin" className="flex flex-col items-center text-gray-600 hover:text-primary">
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Admin</span>
        </Link>
      )}
    </nav>
  );
};
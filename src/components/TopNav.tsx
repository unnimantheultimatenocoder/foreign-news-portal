import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Home, BookmarkIcon, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "./ThemeToggle";

interface TopNavProps {
  title?: string;
}

export const TopNav = ({ title }: TopNavProps) => {
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
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-[1000] border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="px-4 py-3 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#FF0000] font-serif tracking-wide" style={{ transform: 'translateZ(0)', fontFamily: 'Roboto Slab' }}>
            {title || 'Around the Globe'}
          </h1>
        </div>
        {!title && (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/saved" className="flex items-center gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  <span>Saved</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

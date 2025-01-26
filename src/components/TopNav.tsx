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
import { useMediaQuery } from 'react-responsive';

interface TopNavProps {
  title?: string;
}

export const TopNav = ({ title }: TopNavProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
      <div className="max-w-5xl mx-auto px-4 py-2">
        {!title && (
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={isMobile ? "mobile" : "icon"}
                  className="active:bg-accent/50" // Add touch feedback
                  aria-label="Open menu"
                >
                  <Menu className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-3 py-3 px-4 focus:bg-accent active:bg-accent/70"
                    role="menuitem"
                  >
                    <Home className="h-5 w-5" />
                    <span className="text-base">Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/saved"
                    className="flex items-center gap-3 py-3 px-4 focus:bg-accent active:bg-accent/70"
                    role="menuitem"
                  >
                    <BookmarkIcon className="h-5 w-5" />
                    <span className="text-base">Saved</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 py-3 px-4 focus:bg-accent active:bg-accent/70"
                    role="menuitem"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-base">Profile</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 py-3 px-4 focus:bg-accent active:bg-accent/70"
                      role="menuitem"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="text-base">Admin</span>
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

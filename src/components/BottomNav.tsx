import { Link, useLocation } from "react-router-dom";
import { Home, BookmarkIcon, User, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const BottomNav = () => {
  const location = useLocation();
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

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center gap-1 ${
          isActive ? 'text-red-500' : 'text-gray-400'
        } transition-colors relative`}
      >
        <Icon className="h-6 w-6" />
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -top-4 w-1 h-1 bg-red-500 rounded-full"
          />
        )}
      </Link>
    );
  };

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 py-4 px-8 flex justify-around items-center z-50"
    >
      <NavLink to="/" icon={Home} label="Home" />
      <NavLink to="/saved" icon={BookmarkIcon} label="Saved" />
      <NavLink to="/profile" icon={User} label="Profile" />
      {isAdmin && (
        <NavLink to="/admin" icon={Settings} label="Admin" />
      )}
    </motion.nav>
  );
};
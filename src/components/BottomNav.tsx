import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookmarkIcon, User, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const BottomNav = ({ onHomeClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -top-3 w-1 h-1 bg-red-500 rounded-full"
          />
        )}
      </Link>
    );
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      onHomeClick?.();
    } else {
      navigate('/');
    }
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-[hsl(224,71.4%,4.1%)] border-t border-gray-800 py-3 sm:py-4 px-6 sm:px-8 flex justify-around items-center z-50"
    >
      <button onClick={handleHomeClick}><NavLink to="/" icon={Home} label="Home" /></button>
      <NavLink to="/saved" icon={BookmarkIcon} label="Saved" />
      <NavLink to="/profile" icon={User} label="Profile" />
      {isAdmin && (
        <NavLink to="/admin" icon={Settings} label="Admin" />
      )}
    </motion.nav>
  );
};

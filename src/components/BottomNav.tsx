import { Link } from "react-router-dom";
import { Home, BookmarkIcon, User, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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

  const NavLink = ({ to, icon: Icon, label, isActive = false }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <Link 
        to={to} 
        className={`flex flex-col items-center ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        } hover:text-primary transition-colors`}
      >
        <Icon className="h-6 w-6" />
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
          />
        )}
      </Link>
    </motion.div>
  );

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border py-4 px-8 flex justify-around items-center z-50"
    >
      <NavLink to="/" icon={Home} label="Home" isActive={true} />
      <NavLink to="/saved" icon={BookmarkIcon} label="Saved" />
      <NavLink to="/profile" icon={User} label="Profile" />
      {isAdmin && (
        <NavLink to="/admin" icon={Settings} label="Admin" />
      )}
    </motion.nav>
  );
};
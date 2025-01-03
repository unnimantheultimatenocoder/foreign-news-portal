import { Link } from "react-router-dom";
import { Home, Search, BookmarkIcon, User, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const BottomNav = () => {
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

      console.log("Admin check profile:", profile); // Debug log
      return profile?.role === 'admin';
    }
  });

  const NavLink = ({ to, icon: Icon, label }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={to} className="flex flex-col items-center text-gray-600 hover:text-primary">
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{label}</span>
      </Link>
    </motion.div>
  );

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50"
    >
      <NavLink to="/" icon={Home} label="Home" />
      <NavLink to="/search" icon={Search} label="Search" />
      <NavLink to="/saved" icon={BookmarkIcon} label="Saved" />
      <NavLink to="/profile" icon={User} label="Profile" />

      {isAdmin && (
        <NavLink to="/admin" icon={Settings} label="Admin" />
      )}
    </motion.nav>
  );
};
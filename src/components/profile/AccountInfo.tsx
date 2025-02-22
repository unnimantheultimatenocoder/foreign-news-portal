import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export const AccountInfo = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return null;
      }
      return session.user;
    },
    retry: false,
    meta: {
      errorHandler: () => {
        navigate('/auth');
      }
    }
  });

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // First try to get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only attempt to sign out if there's an active session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-lg shadow-lg p-6 border border-border/50"
      >
        <p className="text-center text-muted-foreground">Loading...</p>
      </motion.div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-lg shadow-lg p-6 border border-border/50"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-black dark:text-white mb-4"
      >
        Account Information
      </motion.h2>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-1 text-black dark:text-white"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full sm:w-auto hover:bg-destructive/90 transition-colors"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { TrendingArticles } from "@/components/TrendingArticles";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AccountInfo } from "@/components/profile/AccountInfo";
import { NotificationPreferences } from "@/components/profile/NotificationPreferences";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check session on mount and set up listener
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) {
        navigate('/auth');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (!session) {
        navigate('/auth');
        return null;
      }
      return session;
    },
    retry: false,
    meta: {
      errorHandler: (error) => {
        console.error('Session error:', error);
        toast({
          title: "Session Error",
          description: "There was an error loading your session. Please try logging in again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    }
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // If no profile exists, try to create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: session?.user?.id }])
          .select()
          .maybeSingle();

        if (createError) throw createError;
        return newProfile;
      }

      return data;
    },
    retry: false,
    meta: {
      errorHandler: (error) => {
        console.error('Profile error:', error);
        toast({
          title: "Profile Error",
          description: "There was an error loading your profile. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    }
  });

  useEffect(() => {
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
        if (event === 'SIGNED_OUT' || (!currentSession && !sessionLoading)) {
          navigate('/auth');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    const unsubscribe = setupAuthListener();
    return () => {
      unsubscribe();
    };
  }, [navigate, sessionLoading]);

  if (sessionLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ProfileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <AccountInfo />
        <NotificationPreferences />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg shadow-lg p-6 border border-border/50"
        >
          <TrendingArticles />
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
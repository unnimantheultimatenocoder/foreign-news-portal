import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const NotificationPreferences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('No user session found');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const { data: categories, error: categoriesError } = await supabase
        .from('user_category_preferences')
        .select('category_id')
        .eq('user_id', session.user.id);

      if (categoriesError) throw categoriesError;

      return {
        notification_settings: profile?.notification_settings || {
          email: false,
          push: false,
        },
        categories: categories?.map(c => c.category_id) || [],
      };
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: { notification_settings: { email: boolean; push: boolean } }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('No user session found');

      const { error } = await supabase
        .from('profiles')
        .update({ notification_settings: newSettings.notification_settings })
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      toast({
        title: "Success",
        description: "Your preferences have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating preferences:", error);
    },
  });

  const handleNotificationToggle = (type: 'email' | 'push') => {
    if (!preferences?.notification_settings) return;

    const newSettings = {
      notification_settings: {
        ...preferences.notification_settings,
        [type]: !preferences.notification_settings[type],
      },
    };

    mutation.mutate(newSettings);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-card rounded-lg shadow-lg p-6 border border-border/50"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-xl font-semibold text-black dark:text-white mb-6"
      >
        Notification Preferences
      </motion.h2>
      
      <div className="space-y-6">
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white">Email Notifications</h3>
            <p className="text-sm text-black/70 dark:text-white/70">Receive news updates via email</p>
          </div>
          <Switch
            checked={preferences?.notification_settings?.email || false}
            onCheckedChange={() => handleNotificationToggle('email')}
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white">Push Notifications</h3>
            <p className="text-sm text-black/70 dark:text-white/70">Get instant updates on your device</p>
          </div>
          <Switch
            checked={preferences?.notification_settings?.push || false}
            onCheckedChange={() => handleNotificationToggle('push')}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
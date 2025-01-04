import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserPreferences, updateUserPreferences } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export const NotificationPreferences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences,
  });

  const mutation = useMutation({
    mutationFn: updateUserPreferences,
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
    if (!preferences) return;

    const newSettings = {
      ...preferences,
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
            checked={preferences?.notification_settings.email}
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
            checked={preferences?.notification_settings.push}
            onCheckedChange={() => handleNotificationToggle('push')}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
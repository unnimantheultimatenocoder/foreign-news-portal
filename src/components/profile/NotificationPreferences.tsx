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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-lg shadow-lg p-6 border border-border/50"
    >
      <h2 className="text-xl font-semibold text-primary mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground">Email Notifications</h3>
            <p className="text-muted-foreground text-sm">Receive news updates via email</p>
          </div>
          <Switch
            checked={preferences?.notification_settings.email}
            onCheckedChange={() => handleNotificationToggle('email')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground">Push Notifications</h3>
            <p className="text-muted-foreground text-sm">Get instant updates on your device</p>
          </div>
          <Switch
            checked={preferences?.notification_settings.push}
            onCheckedChange={() => handleNotificationToggle('push')}
          />
        </div>
      </div>
    </motion.div>
  );
};
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getUserPreferences, updateUserPreferences } from "@/lib/api";
import { BottomNav } from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences,
  });

  const mutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your preferences have been updated.",
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-6">Notification Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <p className="text-secondary text-sm">Receive news updates via email</p>
              </div>
              <Switch
                checked={preferences?.notification_settings.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <p className="text-secondary text-sm">Get instant updates on your device</p>
              </div>
              <Switch
                checked={preferences?.notification_settings.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
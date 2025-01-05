import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Users, Newspaper, Tag, Rss } from "lucide-react";

export default function Settings() {
  const settings = [
    {
      title: "General Settings",
      icon: <SettingsIcon className="h-6 w-6" />,
      description: "Configure general application settings"
    },
    {
      title: "User Management",
      icon: <Users className="h-6 w-6" />,
      description: "Manage user roles and permissions"
    },
    {
      title: "Content Settings",
      icon: <Newspaper className="h-6 w-6" />,
      description: "Configure content moderation settings"
    },
    {
      title: "Tag Management",
      icon: <Tag className="h-6 w-6" />,
      description: "Manage article tags and categories"
    },
    {
      title: "Source Settings",
      icon: <Rss className="h-6 w-6" />,
      description: "Configure news sources and feeds"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.map((setting) => (
          <Card key={setting.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                {setting.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{setting.title}</h2>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
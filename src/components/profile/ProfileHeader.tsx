import { ThemeToggle } from "@/components/ThemeToggle";

export const ProfileHeader = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};
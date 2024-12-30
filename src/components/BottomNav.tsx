import { Home, Search, BookmarkIcon, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Search" },
  { icon: BookmarkIcon, label: "Saved" },
  { icon: User, label: "Profile" },
];

export const BottomNav = () => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50"
    >
      <nav className="max-w-lg mx-auto">
        <ul className="flex justify-around items-center">
          {navItems.map((item) => (
            <li key={item.label}>
              <button className="flex flex-col items-center p-2 text-secondary hover:text-accent transition-colors">
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};
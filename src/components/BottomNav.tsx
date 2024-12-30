import { Home, Search, BookmarkIcon, User, Grid } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid, label: "Categories", path: "/categories" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: BookmarkIcon, label: "Saved", path: "/saved" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
              <button
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 transition-colors ${
                  location.pathname === item.path
                    ? "text-accent"
                    : "text-secondary hover:text-accent"
                }`}
              >
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
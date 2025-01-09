import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Home, BookmarkIcon, User } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories?: Category[];
}

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  categories,
}: CategoryFilterProps) => {
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto scrollbar-hide py-4"
    >
      <div className="flex space-x-2 px-4 min-w-max">
        <DropdownMenu>
          <DropdownMenuTrigger className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2">
            Menu
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/saved" className="flex items-center gap-2">
                <BookmarkIcon className="h-4 w-4" />
                <span>Saved</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-semibold text-primary"
              onSelect={() => onSelectCategory('All')}
            >
              All Categories
            </DropdownMenuItem>
            {safeCategories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onSelect={() => onSelectCategory(category.name)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {safeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.name
                ? "bg-accent text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
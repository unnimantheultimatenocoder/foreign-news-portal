import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: Category[];
}

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  categories = [],
}: CategoryFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto scrollbar-hide py-4"
    >
      <div className="flex space-x-2 px-4 min-w-max">
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? "bg-accent text-white"
              : "bg-gray-100 text-secondary hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.name
                ? "bg-accent text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
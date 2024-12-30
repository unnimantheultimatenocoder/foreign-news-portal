import { motion } from "framer-motion";

const categories = [
  "All",
  "Immigration",
  "Jobs",
  "Education",
  "Visa Updates",
  "Migration",
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto scrollbar-hide py-4"
    >
      <div className="flex space-x-2 px-4 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-accent text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
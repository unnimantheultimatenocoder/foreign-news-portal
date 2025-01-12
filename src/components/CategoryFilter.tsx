import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api/types";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        Loading categories...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center"
    >
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-4 gap-2 max-w-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          key="all"
          onClick={() => onSelectCategory("All")}
          className={`snap-start flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            selectedCategory === "All"
              ? "bg-accent text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories
          .filter(category => category.name !== "Health" && category.name !== "Science and Technology" && category.name !== "Science" && category.name !== "Technology" && category.name !== "Business")
          .concat(categories.find(category => category.name === "courses") ? [categories.find(category => category.name === "courses")!] : [])
          .map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`snap-start flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
        ))}
      </div>
    </motion.div>
  );
};

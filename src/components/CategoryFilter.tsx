import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api/types";
import { Button } from "@/components/ui/button";

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

  if (loading) {
    return (
      <div className="px-4 text-sm text-gray-500">
        Loading categories...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center mt-0 w-full overflow-hidden"
    >
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-4 gap-3 w-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x proximity'
        }}
      >
        <Button
          key="all"
          onClick={() => onSelectCategory("All")}
          variant={selectedCategory === "All" ? "default" : "ghost"}
          className={`flex-none px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-pan-x ${
            selectedCategory === "All"
              ? "bg-[#FF0000] text-white hover:bg-[#FF0000] hover:text-white"
              : "hover:bg-red-100 hover:text-red-900"
          }`}
        >
          All
        </Button>
        {categories
          .filter(category => category.name !== "Health" && category.name !== "Science and Technology" && category.name !== "Science" && category.name !== "Technology" && category.name !== "Business")
          .concat(categories.find(category => category.name === "courses") ? [categories.find(category => category.name === "courses")!] : [])
          .map((category) => (
            <Button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className={`flex-none px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-pan-x ${
                selectedCategory === category.id
                  ? "bg-[#FF0000] text-white hover:bg-[#FF0000] hover:text-white"
                  : "hover:bg-red-100 hover:text-red-900"
              }`}
            >
              {category.name}
            </Button>
          ))}
      </div>
    </motion.div>
  );
};

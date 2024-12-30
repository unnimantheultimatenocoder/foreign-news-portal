import { useState } from "react";
import { motion } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";
import { BottomNav } from "@/components/BottomNav";
import { CategoryFilter } from "@/components/CategoryFilter";

// Mock data for initial development
const mockNews = [
  {
    id: 1,
    title: "New Immigration Policy Changes Announced",
    summary: "Major changes to immigration policies have been announced, affecting visa processing times and requirements. The new regulations aim to streamline the application process while maintaining security standards.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "Immigration",
    date: "2024-02-20",
    url: "#",
  },
  {
    id: 2,
    title: "Tech Companies Announce Global Hiring Spree",
    summary: "Leading technology companies have announced plans to hire thousands of workers globally. This expansion creates new opportunities for international job seekers in various technical roles.",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Jobs",
    date: "2024-02-19",
    url: "#",
  },
  {
    id: 3,
    title: "Universities Open Applications for International Students",
    summary: "Top universities worldwide have opened their application portals for the upcoming academic year, offering various scholarships and funding opportunities for international students.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Education",
    date: "2024-02-18",
    url: "#",
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNews = selectedCategory === "All"
    ? mockNews
    : mockNews.filter(news => news.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Global News</h1>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNews.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
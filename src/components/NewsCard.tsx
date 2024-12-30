import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
  url: string;
}

export const NewsCard = ({ title, summary, imageUrl, category, date, url }: NewsCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="overflow-hidden cursor-pointer group">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-secondary">{date}</span>
              <ArrowUpRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-secondary line-clamp-3 text-sm">{summary}</p>
          </div>
        </a>
      </Card>
    </motion.div>
  );
};
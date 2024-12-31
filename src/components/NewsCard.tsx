import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
  url: string;
}

export const NewsCard = ({ title, summary, imageUrl, category, date, url }: NewsCardProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: "50px",
      }
    );

    const element = document.querySelector(`[data-image-url="${imageUrl}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [imageUrl]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="overflow-hidden cursor-pointer group">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-48 overflow-hidden" data-image-url={imageUrl}>
            {isIntersecting && (
              <img
                src={imageUrl}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } group-hover:scale-105`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
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
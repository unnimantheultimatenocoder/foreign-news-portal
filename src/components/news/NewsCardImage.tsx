import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NewsCardImageProps {
  imageUrl: string;
  title: string;
}

export const NewsCardImage = ({ imageUrl, title }: NewsCardImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>("");
  
  useEffect(() => {
    const img = new Image();
    
    // First load a lower quality version
    const lowQualityUrl = imageUrl.replace(/\.(jpg|jpeg|png)/i, '_small.$1');
    setImageSrc(lowQualityUrl);
    
    // Then load the high quality version
    img.src = imageUrl;
    img.onload = () => {
      setImageSrc(imageUrl);
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  return (
    <motion.div 
      className="relative w-full aspect-video overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800"
      whileTap={{ scale: 0.98 }}
    >
      <motion.img
        src={imageSrc || imageUrl}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-60' : 'opacity-100'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0.6 : 1 }}
        loading="lazy"
        aria-label={title}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

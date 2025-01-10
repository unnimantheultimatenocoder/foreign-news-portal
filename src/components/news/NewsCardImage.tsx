import { useState } from 'react';

interface NewsCardImageProps {
  imageUrl: string;
  title: string;
}

export const NewsCardImage = ({ imageUrl, title }: NewsCardImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-[3/2] max-h-[200px] overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
      {!hasError ? (
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <span>Image not available</span>
        </div>
      )}
      {!imageLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
};

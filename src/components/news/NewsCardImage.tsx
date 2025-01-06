import { useState } from 'react';

interface NewsCardImageProps {
  imageUrl: string;
  title: string;
}

export const NewsCardImage = ({ imageUrl, title }: NewsCardImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative h-48 overflow-hidden rounded-t-xl">
      <img
        src={imageUrl}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
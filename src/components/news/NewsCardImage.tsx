import { useState, useRef } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';

interface NewsCardImageProps {
  imageUrl: string;
  title: string;
}

export const NewsCardImage = ({ imageUrl, title }: NewsCardImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleDownload = () => {
    if (imageRef.current) {
      const link = document.createElement('a');
      link.href = imageRef.current.src;
      link.download = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1));
  };

  return (
    <>
      <div 
        className="relative aspect-[3/2] max-h-[200px] overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <div className="relative w-full h-full">
            <img
              ref={imageRef}
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

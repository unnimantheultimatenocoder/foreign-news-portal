import { Share2, ExternalLink, Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NewsCardActionsProps {
  onShare: () => void;
  onSave: () => void;
  onDelete?: () => void;
  onReadMore: () => void;
  isSaved: boolean;
  showDelete?: boolean;
}

export const NewsCardActions = ({
  onShare,
  onSave,
  onDelete,
  onReadMore,
  isSaved,
  showDelete = false
}: NewsCardActionsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-3 mt-auto pt-3">
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex-1 text-xs sm:text-sm dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-700 active:bg-accent/50"
        onClick={onReadMore}
        aria-label="Read full article"
      >
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="ml-1.5">Read article</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-700 active:bg-accent/50"
        onClick={onShare}
        aria-label="Share article"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-100" />
      </Button>
      <Button
        variant={isSaved ? "default" : "outline"}
        size="icon"
        className={`${isSaved ? 
          "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 active:bg-red-800" : 
          "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 active:bg-accent/50"}`}
        onClick={onSave}
        aria-label={isSaved ? "Remove from saved articles" : "Save article"}
      >
        <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-white' : 'dark:text-gray-100'}`} />
      </Button>
      {showDelete && (
        <Button
          variant="outline"
          size="icon"
          className="dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-gray-700 active:bg-red-900/50"
          onClick={onDelete}
          aria-label="Delete article"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-100" />
        </Button>
      )}
    </div>
  );
};

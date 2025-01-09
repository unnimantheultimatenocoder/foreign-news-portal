import { Share2, ExternalLink, Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="p-4 pt-0 grid grid-cols-[1fr,auto,auto] gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700"
        onClick={onReadMore}
      >
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
        Read article
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700"
        onClick={onShare}
      >
        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
      <Button
        variant={isSaved ? "default" : "outline"}
        size="icon"
        className={`h-8 w-8 ${isSaved ? 
          "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" : 
          "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700"}`}
        onClick={onSave}
      >
        <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${isSaved ? 'fill-white' : ''}`} />
      </Button>
      {showDelete && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-gray-700"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      )}
    </div>
  );
};
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
    <div className="px-6 pb-6 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 bg-white dark:bg-gray-900"
        onClick={onReadMore}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Read full article
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white dark:bg-gray-900"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
      <Button
        variant={isSaved ? "default" : "outline"}
        size="icon"
        className={isSaved ? "bg-red-500 hover:bg-red-600" : "bg-white dark:bg-gray-900"}
        onClick={onSave}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
      </Button>
      {showDelete && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      )}
    </div>
  );
};
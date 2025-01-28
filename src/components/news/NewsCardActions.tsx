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
        variant="default"
        size={isMobile ? "default" : "sm"}
        className="flex-1 text-xs sm:text-sm bg-red-500 text-white"
        onClick={onReadMore}
        aria-label="Read full article"
      >
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="ml-1.5">Read article</span>
      </Button>
      <Button
        variant="default"
        size="icon"
        className="bg-red-500 text-white"
        onClick={onShare}
        aria-label="Share article"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button
        variant={isSaved ? "default" : "default"}
        size="icon"
        className={`${isSaved ? 
          "bg-red-600 hover:bg-red-700 active:bg-red-800" : 
          "bg-red-500 text-white"}`}
        onClick={onSave}
        aria-label={isSaved ? "Remove from saved articles" : "Save article"}
      >
        <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-white' : ''}`} />
      </Button>
      {showDelete && (
      <Button
        variant="default"
        size="icon"
        className="bg-red-500 text-white"
        onClick={onDelete}
        aria-label="Delete article"
      >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      )}
    </div>
  );
};

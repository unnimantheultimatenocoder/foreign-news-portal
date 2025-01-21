import { Share2, Bookmark, BookmarkCheck, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mobileService } from "@/services/mobile";

interface NewsCardActionsProps {
  title?: string;
  url?: string;
  onShare?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onReadMore?: () => void;
  isSaved?: boolean;
  showDelete?: boolean;
}

export const NewsCardActions = ({
  title,
  url,
  onShare,
  onSave,
  onDelete,
  onReadMore,
  isSaved,
  showDelete
}: NewsCardActionsProps) => {
  const handleShare = async () => {
    if (title && url) {
      await mobileService.shareContent(
        title,
        "Check out this interesting article!",
        url
      );
    }
    onShare?.();
  };

  return (
    <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={handleShare}
          aria-label="Share article"
        >
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={onSave}
          aria-label={isSaved ? "Remove from saved" : "Save article"}
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
          ) : (
            <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
        {showDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-red-500 hover:text-red-600"
            onClick={onDelete}
            aria-label="Delete article"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-sm gap-1.5"
        onClick={onReadMore}
      >
        Read More
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};

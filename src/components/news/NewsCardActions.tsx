import { Share2, ExternalLink, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsCardActionsProps {
  onShare: () => void;
  onSave: () => void;
  onReadMore: () => void;
  isSaved: boolean;
}

export const NewsCardActions = ({
  onShare,
  onSave,
  onReadMore,
  isSaved
}: NewsCardActionsProps) => {
  return (
    <div className="px-6 pb-6 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={onReadMore}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Read full article
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
      <Button
        variant={isSaved ? "default" : "outline"}
        size="icon"
        onClick={onSave}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
};
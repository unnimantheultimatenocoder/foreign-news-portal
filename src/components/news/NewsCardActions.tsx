import { Share2, ExternalLink, Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from 'react';

interface NewsCardActionsProps {
  onShare: (platform: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy') => void;
  onSave: () => void;
  onDelete?: () => void;
  onReadMore: () => void;
  isSaved: boolean;
  showDelete?: boolean;
  title: string;
  id: string;
}

export const NewsCardActions = ({
  onShare,
  onSave,
  onDelete,
  onReadMore,
  isSaved,
  showDelete = false,
  title,
  id
}: NewsCardActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleCopyLink = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onShare('copy');
    setIsOpen(false);
  };

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
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="bg-red-500 text-white"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900">
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            onShare('twitter');
            setIsOpen(false);
          }}>
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            onShare('facebook');
            setIsOpen(false);
          }}>
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            onShare('linkedin');
            setIsOpen(false);
          }}>
            Share on LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            onShare('email');
            setIsOpen(false);
          }}>
            Share via Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

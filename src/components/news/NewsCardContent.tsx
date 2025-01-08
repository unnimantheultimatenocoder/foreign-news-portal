import { ChevronDown } from 'lucide-react';

interface NewsCardContentProps {
  title: string;
  summary: string;
  source: string;
  date: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const NewsCardContent = ({ 
  title, 
  summary, 
  source, 
  date,
  expanded = false,
  onToggleExpand 
}: NewsCardContentProps) => {
  return (
    <div className="p-4 sm:p-6 news-card-content">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 dark:text-dark-text">
        {title}
      </h3>
      <div 
        className={`relative transition-all duration-500 ease-in-out ${
          expanded ? 'max-h-[1000px]' : 'max-h-[4.5em]'
        } overflow-hidden`}
        style={{
          WebkitOverflowScrolling: 'touch',
          overflowY: expanded ? 'visible' : 'hidden'
        }}
      >
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          {summary}
        </p>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center justify-between">
        <div className="text-xs sm:text-sm text-muted-foreground dark:text-dark-muted">
          <span>{source}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className="text-primary hover:text-primary/80 transition-colors dark:text-dark-text dark:hover:text-dark-muted p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={expanded ? 'Show less' : 'Read more'}
          >
            <ChevronDown 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
            />
          </button>
        )}
      </div>
    </div>
  );
};
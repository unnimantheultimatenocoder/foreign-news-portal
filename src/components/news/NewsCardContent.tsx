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
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold mb-2 line-clamp-2 dark:text-gray-100">
        {title}
      </h3>
      <div 
        className={`relative transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[1000px]' : 'max-h-[4.5em] overflow-hidden'
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {summary}
        </p>
        {!expanded && summary.length > 200 && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#1A1F2C] to-transparent" />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>{source}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        {onToggleExpand && summary.length > 200 && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            aria-label={expanded ? "Show less" : "Read more"}
          >
            <span className="text-xs">{expanded ? "Show less" : "Read more"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
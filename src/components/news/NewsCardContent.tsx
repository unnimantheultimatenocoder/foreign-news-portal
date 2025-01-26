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
    <div className="flex flex-col flex-grow space-y-2">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold line-clamp-2 text-gray-900 dark:text-gray-50 tracking-tight">
        {title}
      </h3>
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[1000px] mb-3' : 'max-h-[6em] overflow-hidden'
        }`}
      >
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
          {summary}
        </p>
        {!expanded && summary.length > 200 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/95 dark:from-[#1A1F2C]/95 to-transparent" />
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-primary/90 dark:text-primary/80 hover:text-primary transition-colors">
            {source}
          </span>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            {date}
          </span>
        </div>
        {onToggleExpand && summary.length > 200 && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1.5 text-primary hover:text-primary/90 active:text-primary/70 transition-colors py-1 font-medium"
            aria-label={expanded ? "Show less" : "Read more"}
          >
            <span>{expanded ? "Show less" : "Read more"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-all duration-300 ease-out ${
                expanded ? 'rotate-180 transform-gpu' : ''
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};
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
      <h3 className="text-base sm:text-lg md:text-xl font-bold line-clamp-2 text-gray-100 tracking-tighter font-sans">
        {title}
      </h3>
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[1000px] mb-3' : 'max-h-[6em] overflow-hidden'
        }`}
      >
        <p className="text-sm sm:text-base text-gray-300 leading-snug font-normal text-left font-sans">
          {summary}
        </p>
      </div>
      <div className="flex items-center justify-between text-sm text-white">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-white hover:text-primary transition-colors">
            {source}
          </span>
          <span className="text-white">•</span>
          <span className="text-white font-medium">
            {date}
          </span>
        </div>
        {onToggleExpand && summary.length > 200 && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1.5 text-white hover:text-primary/90 active:text-primary/70 transition-colors py-1 font-medium"
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

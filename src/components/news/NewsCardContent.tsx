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
    <div className="p-6 news-card-content">
      <h3 className="text-xl font-semibold mb-2 line-clamp-2 dark:text-dark-text">
        {title}
      </h3>
      <p className={`news-card-summary ${expanded ? '' : 'line-clamp-2'}`}>
        {summary}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground dark:text-dark-muted">
          <span>{source}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className="text-primary hover:text-primary/80 transition-colors dark:text-dark-text dark:hover:text-dark-muted"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
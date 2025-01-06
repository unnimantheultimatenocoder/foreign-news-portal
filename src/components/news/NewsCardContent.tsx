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
    <div className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
        {title}
      </h3>
      <p className={`text-muted-foreground ${expanded ? '' : 'line-clamp-2'}`}>
        {summary}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span>{source}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface SuggestButtonsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export function SuggestButtons({
  suggestions,
  onSuggestionClick,
  className,
}: SuggestButtonsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 mt-4 max-w-md mx-auto', className)}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="lg"
          onClick={() => onSuggestionClick(suggestion)}
          className="flex items-center justify-center h-24 p-2 text-sm font-medium text-center break-words whitespace-pre-wrap transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
} 
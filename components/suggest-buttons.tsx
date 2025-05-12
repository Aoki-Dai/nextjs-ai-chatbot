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
    <div className={cn('flex flex-wrap gap-2 mt-4', className)}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
          className="text-sm"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
} 
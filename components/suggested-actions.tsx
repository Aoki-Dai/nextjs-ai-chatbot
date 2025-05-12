'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { VisibilityType } from './visibility-selector';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  append,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: '今日のランチは',
      label: '何を食べるべきですか？',
      action: '今日のランチは何を食べるべきですか？予算は1000円以内で、健康的な選択肢を教えてください。',
    },
    {
      title: '週末の過ごし方',
      label: 'を提案してください',
      action: '週末の過ごし方を提案してください。天気が良く、予算は5000円以内で、リフレッシュできるようなプランを教えてください。',
    },
    {
      title: '効率的な家事の',
      label: '進め方を教えてください',
      action: '効率的な家事の進め方を教えてください。週末の2時間でできる、部屋の片付けと掃除の手順を提案してください。',
    },
    {
      title: '今日の運動メニュー',
      label: 'を提案してください',
      action: '今日の運動メニューを提案してください。家でできる30分程度の運動で、体力維持に効果的なものを教えてください。',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid w-full max-w-3xl gap-4 mx-auto sm:grid-cols-2"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="aspect-square"
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="flex flex-col items-start justify-center w-full h-full gap-3 p-6 text-base text-left transition-colors border-2 rounded-2xl hover:bg-muted/50"
          >
            <span className="text-lg font-bold">{suggestedAction.title}</span>
            <span className="text-sm text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  },
);

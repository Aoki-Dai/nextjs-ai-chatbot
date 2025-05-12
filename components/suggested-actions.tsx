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
      title: '今日の天気は？',
      label: '今日の天気予報を確認しましょう',
      action: '今日の天気予報を教えてください。',
    },
    {
      title: '今日の食事は？',
      label: 'おすすめのレシピを提案します',
      action: '今日の夕食のレシピを提案してください。',
    },
    {
      title: '運動メニュー',
      label: '自宅でできる運動を提案します',
      action: '自宅でできる簡単な運動メニューを教えてください。',
    },
    {
      title: '読書のおすすめ',
      label: 'あなたにぴったりの本を提案します',
      action: '最近のおすすめの本を教えてください。',
    },
    {
      title: '今日の予定',
      label: '効率的なスケジュールを提案します',
      action: '今日の予定を効率的に組むためのアドバイスをください。',
    },
    {
      title: 'リラックス方法',
      label: 'ストレス解消法を提案します',
      action: '簡単にできるリラックス方法を教えてください。',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid w-full gap-2 sm:grid-cols-2"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="block"
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
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
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

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
      title: '旅行プラン',
      label: '次の旅行の計画を立てましょう',
      action: '旅行の計画を立てたいんだけど、アドバイスをもらえますか？',
    },
    {
      title: '今日の献立',
      label: '今日の夕食のレシピを提案します',
      action: '今日の夕食、何かいいアイデアある？',
    },
    {
      title: 'ギフト選び',
      label: '大切な人への贈り物を提案します',
      action: 'プレゼント選びで悩んでるんだけど、相談に乗ってくれる？',
    },
    {
      title: '趣味の提案',
      label: '新しい趣味を見つけましょう',
      action: '新しい趣味を始めたいんだけど、何かおすすめある？',
    },
    {
      title: '健康管理',
      label: '健康的な生活習慣を提案します',
      action: '最近体調が優れないんだけど、何かアドバイスある？',
    },
    {
      title: '相談',
      label: 'あなたの悩みに寄り添います',
      action: '最近ちょっと悩みがあって、話を聞いてもらえるかな？',
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

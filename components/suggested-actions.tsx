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
      action: '週末の旅行プランを提案してください。予算は5万円以内で、東京から日帰りで行ける場所を教えてください。',
    },
    {
      title: '今日の献立',
      label: '今日の夕食のレシピを提案します',
      action: '今日の夕食のレシピを提案してください。冷蔵庫にある食材（鶏肉、玉ねぎ、人参、じゃがいも）を使った簡単な料理を教えてください。',
    },
    {
      title: 'ギフト選び',
      label: '大切な人への贈り物を提案します',
      action: '母の日のプレゼントを探しています。予算は1万円以内で、実用的で喜ばれるものを教えてください。',
    },
    {
      title: '趣味の提案',
      label: '新しい趣味を見つけましょう',
      action: '新しい趣味を始めたいです。自宅でできる、手軽に始められる趣味を教えてください。',
    },
    {
      title: '健康管理',
      label: '健康的な生活習慣を提案します',
      action: 'デスクワーク中心の生活で、健康を維持するためのアドバイスをください。',
    },
    {
      title: '家事の効率化',
      label: '家事を効率的に行う方法を提案します',
      action: '忙しい毎日の中で、家事を効率的に行うためのコツを教えてください。',
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

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from '@/components/toast';

const profileFormSchema = z.object({
  aiPreferences: z
    .string()
    .max(500, {
      message: 'ChoiceBuddyに求める特徴は500文字以内で入力してください。',
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      aiPreferences: '',
    },
  });

  // プロフィールデータの読み込み
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          form.setValue('aiPreferences', data.aiPreferences || '');

          // タグを解析して selectedTags に設定
          if (data.aiPreferences) {
            const tags = data.aiPreferences
              .split(',')
              .map((tag: string) => tag.trim())
              .filter(Boolean);
            setSelectedTags(tags);
          }
        }
      } catch (error) {
        console.error('プロフィールの読み込みに失敗しました:', error);
      }
    };

    loadProfile();
  }, [form]);

  const suggestedTags = [
    '論理的な説明を好む',
    '簡潔な回答を望む',
    'フレンドリーな口調',
    '専門的な用語を使用',
    '具体例を含めた説明',
    '段階的な解説',
    'クリエイティブな提案',
    '実用的なアドバイス',
    '励ましの言葉',
    '冷静で客観的',
    'ユーモアを交える',
    '詳細な分析',
  ];

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      const currentValue = form.getValues('aiPreferences') || '';
      const newValue = currentValue ? `${currentValue}, ${tag}` : tag;
      form.setValue('aiPreferences', newValue);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    const newValue = newTags.join(', ');
    form.setValue('aiPreferences', newValue);
  };

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          type: 'success',
          description: 'プロフィールが更新されました。',
        });
      } else {
        throw new Error('プロフィールの更新に失敗しました');
      }
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      toast({
        type: 'error',
        description: 'プロフィールの更新に失敗しました。',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="aiPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  ChoiceBuddyに求める特徴
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="例：論理的な説明を好む、簡潔な回答を望む、専門的な用語を使用してほしい"
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  AIとの対話で重視する特徴や好みを入力してください。下のサジェストからも選択できます。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 選択されたタグの表示 */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">選択された特徴:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => handleTagRemove(tag)}
                  >
                    {tag}
                    <X className="ml-1 size-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* サジェストタグ */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              おすすめの特徴（クリックして追加）:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter((tag) => !selectedTags.includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'プロフィールを更新中...' : 'プロフィールを更新'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

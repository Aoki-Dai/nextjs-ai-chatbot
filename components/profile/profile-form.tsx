'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'ユーザー名は2文字以上で入力してください。',
    })
    .max(30, {
      message: 'ユーザー名は30文字以内で入力してください。',
    }),
  aiPreferences: z
    .string()
    .max(200, {
      message: 'AIに求める特徴は200文字以内で入力してください。',
    })
    .optional(),
  interests: z
    .string()
    .max(200, {
      message: '趣味・興味は200文字以内で入力してください。',
    })
    .optional(),
  occupation: z
    .string()
    .max(100, {
      message: '職業・専門分野は100文字以内で入力してください。',
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      aiPreferences: '',
      interests: '',
      occupation: '',
    },
  });

  function onSubmit(data: ProfileFormValues) {
    // TODO: プロフィール更新のロジックを実装
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザー名</FormLabel>
              <FormControl>
                <Input placeholder="ユーザー名" {...field} />
              </FormControl>
              <FormDescription>
                これは公開されるユーザー名です。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aiPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AIに求める特徴</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="例：論理的な説明を好む、簡潔な回答を望む、専門的な用語を使用してほしい"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                AIとの対話で重視する特徴や好みを入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>趣味・興味</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="例：プログラミング、読書、旅行、音楽"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                あなたの趣味や興味のある分野を入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>職業・専門分野</FormLabel>
              <FormControl>
                <Input
                  placeholder="例：ソフトウェアエンジニア、学生、デザイナー"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                あなたの職業や専門分野を入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">更新</Button>
      </form>
    </Form>
  );
}

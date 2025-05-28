'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    // 同じ状態に対して複数回トーストを表示しないようにする
    if (
      hasShownToast &&
      state.status !== 'idle' &&
      state.status !== 'in_progress'
    ) {
      return;
    }

    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
      setHasShownToast(true);
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
      setHasShownToast(true);
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
      setHasShownToast(true);
    } else if (state.status === 'success') {
      toast({ type: 'success', description: 'Account created successfully!' });

      setIsSuccessful(true);
      // 認証成功時はsessionの更新のみ行い、router.refresh()は削除
      updateSession().then(() => {
        // セッション更新後にホームページへリダイレクト
        router.push('/');
      });
      setHasShownToast(true);
    }
  }, [state.status, router, updateSession, hasShownToast]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    setHasShownToast(false); // フォーム送信時にリセット
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">新規登録</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            メールアドレスとパスワードでアカウントを作成
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>新規登録</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {'すでにアカウントをお持ちの方は '}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              サインイン
            </Link>
            {' してください。'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}

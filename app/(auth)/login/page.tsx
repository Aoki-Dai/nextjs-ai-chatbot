'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
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

    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });
      setHasShownToast(true);
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
      setHasShownToast(true);
    } else if (state.status === 'success') {
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
    <div className="flex items-start justify-center w-screen pt-12 h-dvh md:pt-0 md:items-center bg-background">
      <div className="flex flex-col w-full max-w-md gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            サインイン
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            メールアドレスとパスワードでサインイン
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>サインイン</SubmitButton>
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-zinc-400">
            {'アカウントをお持ちでない方は '}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              新規登録
            </Link>
            {' してください。'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}

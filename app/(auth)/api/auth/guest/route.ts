import { signIn } from '@/app/(auth)/auth';
import { isDevelopmentEnvironment } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirectUrl') || '/';

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ログインまたは登録ページにリダイレクトされそうな場合は、ログインページへ
  let url;
  try {
    url = new URL(redirectUrl);
  } catch (error) {
    console.error('Invalid redirectUrl:', redirectUrl, error);
    url = new URL('/', request.url); // Fallback to root URL
  }
  if (url.pathname === '/login' || url.pathname === '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return signIn('guest', { redirect: true, redirectTo: redirectUrl });
}

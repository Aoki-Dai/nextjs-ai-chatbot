import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 相対URLの場合はbaseUrlを使用
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // 同じオリジンの場合はそのまま返す
      else if (new URL(url).origin === baseUrl) return url;
      // それ以外はベースURLにリダイレクト
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

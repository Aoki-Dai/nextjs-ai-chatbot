'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { SidebarToggle } from '@/components/sidebar-toggle';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <SidebarToggle />
        </div>
      </div>
      <main className="flex-1 container max-w-4xl mx-auto">
        <div className="py-8 px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              プロフィール設定
            </h1>
            <p className="mt-2 text-muted-foreground">
              ChoiceBuddyがあなたに最適な回答をするために、求める特徴を設定してください
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ProfileForm />
          </div>
        </div>
      </main>
    </div>
  );
}

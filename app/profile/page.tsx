'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { SidebarToggle } from '@/components/sidebar-toggle';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-2">
        <SidebarToggle />
      </div>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">プロフィール</h1>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}

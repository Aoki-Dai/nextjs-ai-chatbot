import { Metadata } from 'next';
import { ProfileForm } from '@/components/profile/profile-form';

export const metadata: Metadata = {
  title: 'ChoiceBuddy',
  description: 'ユーザープロフィールの管理',
};

export default function ProfilePage() {
  return (
    <div className="container py-10 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">プロフィール</h1>
        <ProfileForm />
      </div>
    </div>
  );
}

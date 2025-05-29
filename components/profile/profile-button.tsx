'use client';

import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProfileButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/profile');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="hover:bg-accent hover:text-accent-foreground"
    >
      <User className="size-5" />
      <span className="sr-only">プロフィールを表示</span>
    </Button>
  );
}

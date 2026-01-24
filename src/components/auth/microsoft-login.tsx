'use client';

import { Button } from '../ui/button';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import type { Role } from '@/schemas/auth.schema';
import Cookies from 'js-cookie';

interface MicrosoftLoginProps {
  role?: Role;
  disabled?: boolean;
}

export function MicrosoftLogin({ role, disabled }: MicrosoftLoginProps) {
  function handleMicrosoftLogin() {
    // Store the selected role in a cookie before OAuth redirect
    // This will be read by the auth callback to assign the correct role
    if (role) {
      Cookies.set('signup_role', role, {
        expires: 1 / 24, // 1 hour expiry
        sameSite: 'lax',
        path: '/',
      });
    }
    signIn('microsoft-entra-id', { callbackUrl: '/projects' });
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleMicrosoftLogin}
      disabled={disabled}
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
        alt="Microsoft Logo"
        width={16}
        height={16}
      />
      Continue with Microsoft
    </Button>
  );
}

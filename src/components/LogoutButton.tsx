'use client';

import { signOut } from 'next-auth/react';
import { useTransition } from 'react';

type LogoutButtonProps = {
  className?: string;
  callbackUrl?: string;
  label?: string;
};

export default function LogoutButton({ className, callbackUrl = '/login', label = 'Log out' }: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      signOut({ callbackUrl });
    });
  };

  const classes = ['chip', className].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} onClick={handleClick} disabled={pending}>
      {pending ? 'Signing out…' : label}
    </button>
  );
}

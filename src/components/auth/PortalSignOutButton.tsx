"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";

type PortalSignOutButtonProps = {
  callbackUrl: string;
  label?: string;
};

export default function PortalSignOutButton({ callbackUrl, label = "Sign out" }: PortalSignOutButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      signOut({ callbackUrl });
    });
  };

  return (
    <button
      type="button"
      className="chip chip--primary"
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? "Signing out…" : label}
    </button>
  );
}

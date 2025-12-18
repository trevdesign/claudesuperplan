"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className = "" }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 ${className}`}
    >
      Sign Out
    </button>
  );
}

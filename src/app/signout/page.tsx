"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    // Trigger logout when user visits /signout
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Signing you out...</p>
    </div>
  );
}
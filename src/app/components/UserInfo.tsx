'use client';

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return <p>You are not logged in.</p>;

  return (
    <div>
      <p>Welcome, {session.user?.name} 👋</p>
      <p>Jouw rol is {session.user?.role}.</p>
    </div>
  );
}
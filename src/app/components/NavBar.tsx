"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <nav className="flex justify-between p-4">
        <div>
            <Link href="/">Home</Link>
        </div>
        <div className="flex justify-center gap-4">
            <Link href="/books">Books</Link>
            <Link href="/wishlist">WishList</Link>
            {session ? (
                <Link href="/signout">Logout</Link>
            ) : (
                <Link href="/signin">Login</Link>
            )}
        </div>
    </nav>
  );
  }
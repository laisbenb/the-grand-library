'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/"); // redirect to home after login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-lg font-medium hover:bg-orange-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-orange-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

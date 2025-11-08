'use client';

import { useState } from 'react';
import { registerUser } from '@/app/actions/Register';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    if (
      !email.endsWith('@arteveldehs.be') &&
      !email.endsWith('@student.arteveldehs.be')
    ) {
      event.preventDefault();
      setError('Email must be from arteveldehs.be or student.arteveldehs.be');
      return;
    }

    setError(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Register</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form action={registerUser} onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="name" className="mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

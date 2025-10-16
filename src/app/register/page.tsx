// app/register/page.tsx
'use client';

import { useState } from 'react';
import { registerUser } from './action';

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
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form action={registerUser} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

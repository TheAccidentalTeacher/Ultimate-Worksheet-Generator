'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // For now, just go to dashboard
    router.push('/dashboard');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-primary-50">
      <form className="bg-white rounded-xl shadow-md p-8 max-w-md w-full" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Sign In</h2>
        <input
          type="email"
          className="w-full mb-2 p-3 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
        />
        <input
          type="password"
          className="w-full mb-4 p-3 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded font-bold">
          Sign In
        </button>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-primary-600 hover:underline">Need an account? Sign up</a>
        </div>
      </form>
    </main>
  );
}

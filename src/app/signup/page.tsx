'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    // For now, just redirect to login
    router.push('/login');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-primary-50">
      <form className="bg-white rounded-xl shadow-md p-8 max-w-md w-full" onSubmit={handleSignUp}>
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Sign Up</h2>
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
          Create Account
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-primary-600 hover:underline">Already have an account? Sign in</a>
        </div>
      </form>
    </main>
  );
}

"use client";
import { useState } from 'react';
import Link from 'next/link';
import {toast} from 'react-hot-toast';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
    const res = await fetch('http://online-bank-production.up.railway.app/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if(res.ok){
      toast.success(data.message || 'Password reset link sent successfully!');
    } else {
      toast.error(data.message || 'Failed to send reset link. Please try again.');
    }
  } catch(error){
    toast.error('Something went wrong. Please try again later.');
  } finally {
    setSubmitting(false);
    setEmail(''); // Clear the email input after submission
  }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center text-white px-4"
     style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>
      {/* Logo top-left */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 flex items-center space-x-2"
      >
        <img src="/tablogo.png" alt="Logo" className="h-10 w-auto" />
        <img src="/logo2nd1.png" alt="Secondary Logo" className="h-10 w-auto mt-1" />
      </Link>

      {/* Form container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-md text-primary p-8 rounded-xl shadow-lg w-full max-w-md border border-yellow-400"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Forgot Password</h2>

        <label className="block mb-2 text-sm font-medium">Email Address</label>
        <input
          type="email"
          className="w-full p-3 rounded bg-white/80 text-black border placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full mt-6 bg-black hover:bg-gray-800 transition-colors duration-200 text-white py-3 rounded font-medium cursor-pointer"
          disabled={submitting}
        >
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>

        
      </form>
    </div>
  );
}

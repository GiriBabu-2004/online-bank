"use client";
import { useState , use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const { token } = use(params);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      return setError('Both fields are required');
    }

    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Network error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/login-back.jpg')] bg-cover bg-center bg-no-repeat text-primary px-4">
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 flex items-center space-x-2"
      >
        <img src="/tablogo.png" alt="Logo" className="h-10 w-auto" />
        <img src="/logo2nd1.png" alt="Secondary Logo" className="h-10 w-auto mt-1" />
      </Link>
      {/* Form container */}
      <div className="bg-white/20 backdrop-blur-md  p-8 rounded-xl shadow-lg w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-semibold mb-6 text-center">Reset Your Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-white/80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-black hover:bg-gray-800 text-white transition-colors duration-200  py-3 rounded font-medium cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-300 font-medium">{error}</p>}
        {message && <p className="mt-4 text-center text-green-300 font-medium">{message}</p>}
      </div>
    </div>
  );
}

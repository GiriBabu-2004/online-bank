"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaInfoCircle, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa"; // icons for UX
import { Button } from "../../components/ui/button"; // Assuming you have a Button component
import { CardSpotlight } from "@/components/ui/card-spotlight";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"; // Assuming you have a Loader component
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showRules, setShowRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://online-bank-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        toast.error("Server returned an unexpected response");
        return;
      }

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ email }));

      toast.success("Login successful!");

      if (role === "user") {
        router.push("/user-dashboard");
      } else if (role === "admin") {
        router.push("/admin-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[url('/background.png')]  bg-center bg-repeat bg-[length:400px_400px] text-black overflow-hidden"
    style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>
      {/* Logo in top-left */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 flex items-center space-x-2"
      >
        <img src="tablogo.png" alt="Logo" className="h-10  w-auto" />
        <img src="logo2nd1.png" alt="Logo" className="h-10 mt-1 w-auto" />
      </Link>

      {/* Center Section - Login Form */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-1/3 ml-[33.3333%] flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white/20 backdrop-blur-sm  border border-yellow-400 p-10 rounded-lg shadow-lg ">
          <h2 className="text-2xl font-semibold text-center mb-6 text-black">
            Welcome, please login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-md bg-black/10 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="relative" >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-md bg-black/10 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link
                  href="/forgot-password"
                  className="text-sm text-black hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-black"
              >
                Login as
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-md bg-black/10 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              variant="secondary"
              type="submit"
              className={`w-full bg-black text-white hover:bg-gray-900  ${submitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin w-4 h-4" />}
              {submitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-black">
            Don't have an account?{" "}
            <Link href="/register" className="text-yellow-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Floating Toggle Button for Login Rules */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="fixed bottom-5 right-5 bg-yellow-500 text-black px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 flex items-center gap-2 z-50"
      >
        <FaInfoCircle />
        Rules
      </button>

      {/* Spotlight Card for Rules */}
      {showRules && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-20 right-5 z-40 max-w-sm w-full"
        >
          <CardSpotlight className="p-6 bg-black  text-white rounded-lg shadow-lg ">
            <div className="flex justify-between items-center mb-2">
              <h3 className="michroma text-xl mb-3 font-semibold text-yellow-400">
                Login Rules
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="text-white hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="list-disc ml-5 space-y-1 text-sm text-white ">
              <li>Use your registered email and password only.</li>
              <li>Do not share your credentials with anyone.</li>
              <li>Admins must log in using the admin role.</li>
              <li>Too many failed attempts may lock your account.</li>
              <li>Always log out after using a public or shared device.</li>
              <li>
                Do not use browser auto-fill for passwords on shared systems.
              </li>
              <li>Passwords must be updated every 90 days.</li>
              <li>Use the 'Forgot Password' link to reset securely.</li>
            </ul>
          </CardSpotlight>
        </motion.div>
        
      )}
    </div>
  );
}

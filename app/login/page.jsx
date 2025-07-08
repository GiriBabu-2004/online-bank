"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BlurText from "../../components/BlurText/BlurText";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        alert("Server returned an unexpected response");
        return;
      }

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ email }));

      if (role === "user") {
        router.push("/user-dashboard");
      } else if (role === "admin") {
        router.push("/admin-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-200">
      {/* Left Section - Banking Info */}
      <div className="w-1/3 bg-gradient-to-b from-yellow-300 to-black text-white p-8 fixed h-full flex items-center justify-center ">
        <div>
          <BlurText
            text="Welcome to Developer's Bank"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-3xl font-bold text-black mb-8"
          />
          
          <p className="text-md font-semibold leading-relaxed">
            Developer's Bank is your trusted partner in secure and modern banking. Designed with developers and businesses in mind, our platform offers a seamless experience that puts you in full control of your finances. From powerful tools to smooth integrations, everything is built to help you manage money with confidence. Whether you're handling personal accounts or scaling a business, Developer's Bank gives you the freedom, flexibility, and support you need—anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Center Section - Login Form */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-1/3 ml-[33.3333%] flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="text-right mt-1">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium">
                Login as
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right Section - Rules */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-1/3 p-8 flex items-center justify-center"
      >
        <div className="bg-white shadow-md p-6 rounded-lg text-sm text-gray-700 max-w-sm">
          <h3 className="text-xl font-semibold mb-2 text-orange-700">
            Login Rules
          </h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>Use your registered email and password only.</li>
            <li>Do not share your credentials with anyone.</li>
            <li>Admins must log in using the admin role.</li>
            <li>Too many failed attempts may lock your account.</li>
            <li>Always log out after using a public or shared device.</li>
            <li>Do not use browser auto-fill for passwords on shared systems.</li>
            <li>Passwords must be updated every 90 days.</li>
            <li>If you forget your password, use the 'Forgot Password' link to securely reset it via your registered email. Do not attempt to share or guess passwords.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Full user data from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  // State for showing account info securely
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  // We'll get password from backend data, for demo use only — better to handle on backend

  useEffect(() => {
    // Get logged-in user email from localStorage
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      router.replace("/login");
      return;
    }

    const { email } = JSON.parse(loggedUser);

    // Fetch user details from backend by email
    fetch(
      `http://localhost:5000/api/user/by-email/${encodeURIComponent(email)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load user data");
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading user info...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Mask account number for privacy
  const accountNumber = user?.accountNumber || "XXXXXX";
  const maskedAccount = showAccountNumber
    ? accountNumber
    : "XXXXXXXX" + accountNumber.slice(-4);

  // Demo balance (replace with real balance from user.accountDetails if available)
  const balance = user?.accountDetails?.balance || 0;
  const maskedBalance = showBalance ? `₹${balance}` : "₹XXXX.XX";

  const handleVerifyPassword = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            password: inputPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password verification failed");
        return;
      }

      // Password matched
      setShowAccountNumber(true);
      setPasswordModalOpen(false);
      setInputPassword("");
    } catch (err) {
      console.error("Password check error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-md">
        <h2 className="text-xl font-bold mb-6">MyBank</h2>
        <ul className="space-y-4">
          <li>
            <Link href="/user-dashboard" className="hover:text-blue-600 block">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/user-dashboard/statement"
              className="hover:text-blue-600 block"
            >
              Statement
            </Link>
          </li>
          <li>
            <Link
              href="/user-dashboard/account-info"
              className="hover:text-blue-600 block"
            >
              Account Info
            </Link>
          </li>
          <li>
            <Link
              href="/user-dashboard/fd-calculator"
              className="hover:text-blue-600 block"
            >
              FD Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/user-dashboard/mf-calculator"
              className="hover:text-blue-600 block"
            >
              Mutual Fund Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/customer-care"
              className="hover:text-blue-600 block"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 relative">
        {/* Top Right Profile */}
        <div className="absolute top-4 right-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full uppercase">
            {user?.email?.charAt(0)}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("user"); // Clear user data
              router.replace("/login"); // Redirect to login
            }}
            className="text-sm text-red-600 underline hover:text-red-800"
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-16">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            User Details
          </h3>

          <p>
            <strong>Name:</strong> {user?.personalDetails?.firstName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          {/* Account Info */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-2">Account Details</h4>
            <p>
              <strong>Account Type:</strong> {user?.accountDetails?.accountType}
            </p>
            <p>
              <strong>Account Number:</strong> {maskedAccount}{" "}
              {!showAccountNumber && (
                <button
                  onClick={() => setPasswordModalOpen(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Show
                </button>
              )}
            </p>
            <p>
              <strong>Balance:</strong> {maskedBalance}{" "}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-500"
              >
                {showBalance ? "🙈" : "👁️"}
              </button>
            </p>
          </div>
        </div>

        {/* Add Money & Send Money Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2">Add Money</h4>
            <p className="text-gray-600">Easily fund your account instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2">Send Money</h4>
            <p className="text-gray-600">Transfer funds securely to anyone.</p>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-sm shadow-xl">
            <h4 className="text-lg font-bold mb-4">Enter Account Password</h4>
            <input
              type="password"
              className="w-full border p-2 rounded mb-4"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Password"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

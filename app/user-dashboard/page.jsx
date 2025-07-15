"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Loader from "../../components/Loader"
import {
  LayoutDashboard,
  FileText,
  Info,
  Calculator,
  LineChart,
  Headphones,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/user-dashboard",
  },
  {
    icon: <FileText size={20} />,
    label: "Statement",
    href: "/user-dashboard/statement",
  },
  {
    icon: <Info size={20} />,
    label: "Account Info",
    href: "/user-dashboard/account-info",
  },
  {
    icon: <Calculator size={20} />,
    label: "FD Calculator",
    href: "/user-dashboard/fd-calculator",
  },
  {
    icon: <LineChart size={20} />,
    label: "MF Calculator",
    href: "/user-dashboard/mf-calculator",
  },
  {
    icon: <Headphones size={20} />,
    label: "Contact Us",
    href: "/customer-care",
  },
];

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

  const [theme, setTheme] = useState("blue");

  const gradientThemes = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-700",
    green: "bg-gradient-to-r from-green-400 to-green-600",
    purple: "bg-gradient-to-r from-purple-500 to-indigo-700",
    orange: "bg-gradient-to-r from-orange-400 to-red-500",
    pink: "bg-gradient-to-r from-pink-400 to-pink-600",
    teal: "bg-gradient-to-r from-teal-400 to-cyan-600",
    indigo: "bg-gradient-to-r from-indigo-500 to-purple-700",
    yellow: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black", // Keep text readable
    gray: "bg-gradient-to-r from-gray-500 to-gray-700",
    red: "bg-gradient-to-r from-red-500 to-red-700",
    redBlue: "bg-gradient-to-r from-red-500 to-blue-700",
  };

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

  if (loading) return <div><Loader /></div>;
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
      <motion.aside
        className="group fixed h-screen bg-white shadow-md z-10"
        initial={{ width: 80 }}
        whileHover={{ width: 260 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center group-hover:justify-start px-4 py-6 gap-2">
          <img src="/tablogo.png" alt="Logo1" className="w-8 h-8" />
          <img
            src="/logo2nd1.png"
            alt="Logo2"
            className="w-30 h-8 hidden group-hover:block"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-4 mt-6 px-2 ml-3 ">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-4 text-gray-700 p-3 rounded-md hover:bg-blue-100 transition-all"
            >
              {item.icon}
              <span className="hidden group-hover:block">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-12 left-2 right-2 px-2">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.replace("/login");
            }}
            className="w-full flex items-center gap-4 text-red-600 p-3 rounded-md hover:bg-red-100 transition-all"
          >
            <LogOut size={20} />
            <span className="hidden group-hover:block">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-2 p-6 relative">
        {/* Top Right Profile */}
        <div className="absolute top-4 right-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full uppercase">
            {user?.email?.charAt(0)}
          </div>
        </div>







        <div className = "flex flex-row justify-between px-6 py-6 min-h-screen bg-blue-100">
        <div className = "flex-1 mr-6">
          Welcome to ONLINE BANK
          </div>


        {/* Theme Selector */}
        <div className="flex flex-col items-center  justify-end mt-4">
          <div className="flex flex-row w-sm justify-between ">
            <p className="mt-12">My card</p>
            <div className="flex justify-end max-w-2xl mt-10">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {Object.keys(gradientThemes).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Theme
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Info */}
          <div
            className={`rounded-lg shadow-lg w-sm  p-6 max-w-sm mx-auto mt-4 text-white transition-all duration-500 ${gradientThemes[theme]}`}
          >
            {/* <h3 className="text-lg font-semibold  mb-4">User Details</h3>

          <p>
            <strong>Name:</strong> {user?.personalDetails?.firstName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p> */}
            <div className="flex flex-row justify-between  items-center">
              <img src="/tablogo.png" alt="Logo1" className="size-10 -ml-1" />
              <img
                src="/logo2nd1.png"
                alt="Logo2"
                className="w-35 h-10 group-hover:block"
              />
            </div>

            {/* Account Info */}
            <div className="mt-4  pt-4">
              {/* <h4 className="font-semibold mb-2">Account Details</h4>
            <p>
              <strong>Account Type:</strong> {user?.accountDetails?.accountType}
            </p> */}
              <p>
                {maskedAccount}{" "}
                {!showAccountNumber && (
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="text-sm text-white underline hover:text-white/90"
                  >
                    Show
                  </button>
                )}
              </p>
              {/* <p>
              <strong>Balance:</strong> {maskedBalance}{" "}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80"
              >
                {showBalance ? "🙈" : "👁️"}
              </button>
            </p> */}
              <div className="flex flex-row justify-between  pt-6">
                <p>12/24</p>
                <p>CVV</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-6 ">
            <div className="flex flex-row justify-between gap-46">
              <p className="text-gray-400">Card Balance</p>
              <p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/80"
                >
                  {showBalance ? "🙈" : "👁️"}
                </button>
                {maskedBalance}{" "}

              </p>
            </div>
            <div className="flex flex-row justify-between gap-35 mt-2">
              <p className="text-gray-400">Card Limit</p>
              <p>
                ₹100,000,00
              </p>
            </div>

          </div>
          <div className="flex flex-col mt-6 ">
            <div className="flex flex-row justify-between gap-46 mt-2">
              <p className="font-bold">Information</p>
              <p>More Details</p>
            </div>
            <div className="flex flex-row justify-between gap-35 mt-2">
              <p className="text-gray-400">Status</p>
              <p>
                Active
              </p>
            </div>
            <div className="flex flex-row justify-between gap-35 mt-2">
              <p className="text-gray-400">Type Card</p>
              <p>
                Current
              </p>
            </div>
            <div className="flex flex-row justify-between gap-35 mt-2">
              <p className="text-gray-400">Currency</p>
              <p>
                Indian
              </p>
            </div>

          </div>


        </div>
        </div>

        {/* Add Money & Send Money Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2">Add Money</h4>
            <p className="text-gray-600">Easily fund your account instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2">Send Money</h4>
            <p className="text-gray-600">Transfer funds securely to anyone.</p>
          </div>
        </div> */}
      </div>

      {/* Password Modal */}
      {passwordModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} // more transparent background
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl"
          >
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
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

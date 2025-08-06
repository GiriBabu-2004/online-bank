"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  FileText,
  Info,
  Calculator,
  LineChart,
  Headphones,
  LogOut,
  EyeClosed,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // update path if needed

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

import {
  PieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [selectedMonth, setSelectedMonth] = useState("January");

  const [theme, setTheme] = useState("orange");

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
      `https://online-bank-server.onrender.com/api/user/by-email/${encodeURIComponent(email)}`
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

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;

  // Mask account number for privacy
  const accountNumber = user?.accountNumber || "XXXXXX";
  const maskedAccount = showAccountNumber
    ? accountNumber
    : "XXXXXXXX" + accountNumber.slice(-4);

  // Demo balance (replace with real balance from user.accountDetails if available)
  const balance = user?.accountDetails?.balance || "0000.00";
  const maskedBalance = showBalance ? `₹${balance}` : "₹XXXX.XX";

  const handleVerifyPassword = async () => {
    try {
      const res = await fetch(
        "https://online-bank-server.onrender.com/api/user/verify-password",
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
        toast.error(data.message || "Password verification failed");
        return;
      }

      // Password matched
      setShowAccountNumber(true);
      setPasswordModalOpen(false);
      setInputPassword("");
    } catch (err) {
      console.error("Password check error:", err);
      toast.error("Server error");
    }
  };
  const pieData = [
    { name: "Shopping", value: 20, color: "#8B5CF6" },
    { name: "Sport", value: 30, color: "#0EA5E9" },
    { name: "Food", value: 10, color: "#FACC15" },
    { name: "Clothes", value: 25, color: "#4F46E5" },
    { name: "Others", value: 15, color: "#9CA3AF" },
  ];

  const lineData = [
  { name: "Apr", value: 0.2 },
  { name: "May", value: 0.35 },
  { name: "Jun", value: 0.5 },
  { name: "Jul", value: 0.7 },
  { name: "Aug", value: 0.6 },
  { name: "Sep", value: 0.8 },
  { name: "Oct", value: 0.9 },
];

  const transactions = [];

  return (
    <div
      className="flex min-h-screen bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}
    >
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
        <nav className="flex flex-col gap-4 mt-6 px-2 ml-2 ">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-4 text-gray-700 p-3 rounded-md hover:bg-blue-100 transition-all"
            >
              <div className="min-w-[24px]">{item.icon}</div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
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
      <div className="flex-2 pt-16 relative h-screen w-full overflow-hidden">
        {/* Top Right Profile */}
        <div className="absolute top-4 right-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center rounded-full uppercase">
            {user?.email?.charAt(0)}
          </div>
        </div>

        <div className="flex min-h-screen w-full pt-0 px-0 ml-16 overflow-hidden">
          {/* Left Panel - Charts */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <h1 className="text-xl font-bold">Welcome to ONLINE BANK</h1>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white/80 border border-yellow-400 p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold">Expenses by category</p>

                  {/* ShadCN Month Selector */}
                  <Select
                    value={selectedMonth}
                    onValueChange={(value) => setSelectedMonth(value)}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-sm">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-row justify-between">
                  <PieChart width={150} height={150}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>

                  <ul className="mt-4 space-y-1 text-sm text-gray-600">
                    {pieData.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ background: item.color }}
                        ></span>
                        {item.name} {item.value}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-white/80 border border-yellow-400 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold">Transactions</p>
                  <p className="text-sm text-black">More details</p>
                </div>
                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-sm">No transactions yet.</p>
                ) : (
                  <ul className="space-y-4 text-sm">
                    {transactions.map((tx, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tx.icon}</span>
                          <div>
                            <p className="font-medium">{tx.label}</p>
                            <p className="text-gray-400 text-xs">{tx.time}</p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold ${
                            tx.amount.includes("-")
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {tx.amount}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-white/80 border border-yellow-400 p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold">Analytics</p>
                <p className="text-sm text-gray-400">1 year</p>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <ReLineChart data={lineData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel - Card */}
          <div className="w-[340px] h-screen bg-white/80 border border-yellow-400 rounded-l-2xl pl-3 pr-3 pb-3 mr-16  shadow-md">
            {/* Theme Selector */}
            <div className="flex justify-between items-center mt-2 mb-4">
              <p className="font-semibold">My Account</p>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border border-gray-300 rounded px-0.5 py-0.5 text-sm"
              >
                {Object.keys(gradientThemes).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Display */}
            <div
              className={`rounded-lg shadow-md text-white h-45 transition-all duration-500 p-4 ${gradientThemes[theme]}`}
            >
              <div className="flex items-center justify-end">
                <img src="/tablogo.png" alt="Logo1" className="size-8" />
              </div>

              {/* Format Account Number into 4-4-4 */}
              <p className="mt-6 text-xl tracking-widest font-mono">
                {showAccountNumber
                  ? "123456789012".replace(/(.{4})/g, "$1 ").trim()
                  : maskedAccount}{" "}
                {!showAccountNumber && (
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="text-sm text-white underline hover:text-white/90 ml-2 cursor-pointer"
                  >
                    Show
                  </button>
                )}
              </p>
            </div>

            {/* Card Info */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-gray-500">
                <p>Acc. Balance</p>
                <p>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 "
                  >
                    {showBalance ? (
                      <Eye className="w-5 h-5 inline cursor-pointer" />
                    ) : (
                      <EyeClosed className="w-5 h-5 inline cursor-pointer" />
                    )}
                  </button>{" "}
                  {maskedBalance}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between font-semibold">
                <p>Information</p>
                <p className="text-sm font-normal">More Details</p>
              </div>
              <div className="flex justify-between text-gray-500">
                <p>Status</p>
                <p className="text-green-600 font-medium">Active</p>
              </div>
              <div className="flex justify-between text-gray-500">
                <p>Acc. Type</p>
                <p>{user?.accountDetails?.accountType}</p>
              </div>
              <div className="flex justify-between text-gray-500">
                <p>Currency</p>
                <p>Indian</p>
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
                className="px-4 py-2 text-gray-600 hover:bg-red-500 hover:text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPassword}
                className="px-4 py-2 bg-yellow-500 text-black rounded cursor-pointer"
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

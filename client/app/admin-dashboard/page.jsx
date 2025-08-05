"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const router = useRouter();

  const admin = {
    name: "Boss",
    email: "bossofbank@gmail.com",
    image: "",
  };

  useEffect(() => {
    fetch("http://online-bank-production.up.railway.app/api/admin/pending-applications")
      .then((res) => res.json())
      .then(setPendingApplications)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSearch = () => {
    const dummyUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        accountNumber: "123456",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        accountNumber: "789012",
      },
    ];
    const filtered = dummyUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.accountNumber.includes(search)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="flex min-h-screen bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] text-black"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>
      <aside className="w-64 bg-white/80 border border-yellow-400 rounded-r-3xl shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Bank Admin</h2>
        <nav>
          <ul className="space-y-2">
            {["Dashboard", "Applications", "User Accounts", "Transactions", "Reports", "Settings"].map((item) => (
              <li key={item}>
                <a href="#" className="block p-2 hover:bg-blue-100 rounded">{item}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4 gap-4">
            {admin.image ? (
              <img src={admin.image} className="w-10 h-10 rounded-full" alt="Profile" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl font-bold">
                {admin.email.charAt(0).toUpperCase()}
              </div>
            )}
            <button className="text-red-500 cursor-pointer  hover:transform hover:scale-110 transition-transform duration-200 hover:bg-gray-200 rounded-3xl w-10 h-10 flex items-center justify-center"
            onClick={() => {
              localStorage.removeItem("admin");
              router.replace("/login");
            }}>
              <LogOut />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 border border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            {admin.image ? (
              <img src={admin.image} className="w-20 h-20 rounded-full mr-4" alt="Profile" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold mr-4">
                {admin.email.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{admin.name}</h2>
              <p className="text-gray-500">Bank Manager</p>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white/80 border border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
          <ul>
            {pendingApplications.map((app) => (
              <li key={app._id} className="border-b py-4 flex justify-between items-center">
                <div>
                  <p>
                    <strong>
                      {app.personalDetails?.firstName} {app.personalDetails?.lastName}
                    </strong>{" "}
                    - {app.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(app.videoVerificationSubmittedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/pending-application/${app._id}`)}
                  className="bg-orange-600 text-white px-4 py-1 rounded hover:bg-orange-700"
                >
                  Details
                </button>
              </li>
            ))}
            {pendingApplications.length === 0 && (
              <p className="text-gray-500">No pending applications found.</p>
            )}
          </ul>
        </div>

        {/* Search User Accounts */}
        <div className="bg-white/80 border border-yellow-400  rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Search User Accounts</h3>
          <div className="flex mb-4">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-md px-4 py-2"
              placeholder="Enter name, email or account no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-orange-600 text-white px-4 py-2 rounded-r-md hover:bg-orange-700"
            >
              Search
            </button>
          </div>
          <ul>
            {filteredUsers.map((user, i) => (
              <li key={i} className="border-b py-2">
                <p><strong>{user.name}</strong> - {user.email}</p>
                <p className="text-sm text-gray-500">Account No: {user.accountNumber}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

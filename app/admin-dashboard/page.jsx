"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          {greeting}, Admin 👋
        </h1>
        <p className="text-gray-700">Welcome to your dashboard.</p>
      </div>
    </div>
  );
}

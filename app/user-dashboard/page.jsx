"use client";

import React from "react";

export default function UserDashboard({ user }) {
  // `user` can be passed as a prop, or fetched from context or API

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 text-black rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-4">Hello, {user?.firstName || "User"}!</h1>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

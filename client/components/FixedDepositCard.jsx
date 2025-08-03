// components/FixedDepositCard.jsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { IndianRupee } from "lucide-react";

const data = [
  { name: "FD 1", value: 400 },
  { name: "FD 2", value: 300 },
  { name: "FD 3", value: 300 },
  { name: "FD 4", value: 200 },
  { name: "FD 5", value: 100 },
];

const COLORS = ["#fde047", "#facc15", "#fcd34d", "#fef08a", "#fef9c3"];

export default function FixedDepositCard() {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-md w-72 mt-10">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={45}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fixed Deposit Return</p>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            <span className="text-xl font-bold text-black">1,87,118</span>
            <span className="text-xs text-red-500">↓ 2.8%</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
        {["1d", "1w", "1m", "1year", "All Time"].map((label) => (
          <span
            key={label}
            className={`px-2 py-1 rounded-full ${
              label === "All Time" ? "bg-white text-purple-600 font-semibold shadow-sm" : ""
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

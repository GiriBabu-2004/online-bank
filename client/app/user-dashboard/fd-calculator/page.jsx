"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState("years");
  const [compounding, setCompounding] = useState("yearly");
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [chartData, setChartData] = useState([]);

  const compoundingMap = {
    yearly: 1,
    halfYearly: 2,
    quarterly: 4,
    monthly: 12,
  };

  function calculateMaturity() {
    if (!principal || !rate || !tenure) {
      alert("Please fill all fields");
      return;
    }

    const P = parseFloat(principal);
    const R = parseFloat(rate) / 100;
    const n = compoundingMap[compounding];
    let t = parseFloat(tenure);

    if (tenureType === "months") {
      t = t / 12;
    }

    const A = P * Math.pow(1 + R / n, n * t);
    setMaturityAmount(parseFloat(A.toFixed(2)));

    // Create chart data
    const data = [];
    for (let i = 0; i <= n * t; i++) {
      const amt = P * Math.pow(1 + R / n, i);
      data.push({ time: `T${i}`, amount: parseFloat(amt.toFixed(2)) });
    }
    setChartData(data);
  }

  const principalFloat = parseFloat(principal) || 0;
  const interestEarned =
    maturityAmount && principalFloat
      ? (maturityAmount - principalFloat).toFixed(2)
      : "0.00";

  const growthPercent =
    maturityAmount && principalFloat
      ? Math.min(
          100,
          (((maturityAmount - principalFloat) / principalFloat) * 100).toFixed(1)
        )
      : 0;

  return (
    <div
      className="min-h-screen bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl w-full mx-auto bg-white/90 border border-yellow-400 rounded-2xl shadow-lg p-6 grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-yellow-800 text-center">FD Calculator</h2>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Principal Amount (₹)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter principal amount"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter interest rate"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Maturity Term</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter maturity term"
            />
            <select
              value={tenureType}
              onChange={(e) => setTenureType(e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Compounding Frequency</label>
            <select
              value={compounding}
              onChange={(e) => setCompounding(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="yearly">Yearly</option>
              <option value="halfYearly">Half-Yearly</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            onClick={calculateMaturity}
            className="w-full bg-yellow-500 text-white cursor-pointer py-2 rounded-md hover:bg-yellow-600 transition"
          >
            Calculate
          </button>
        </div>

        {/* Result and Visualization */}
        <div className="space-y-6 flex flex-col justify-center items-center">
          {/* Result Box */}
          <div className="bg-green-100 border border-green-300 rounded-xl p-4 w-full max-w-md space-y-2 text-center">
            <p className="text-lg font-semibold text-green-800">
              Maturity Amount: ₹{maturityAmount.toFixed(2)}
            </p>
            <p className="text-lg text-green-700">
              Interest Earned: ₹{interestEarned}
            </p>
          </div>

          {/* Circular Progress */}
          <div className="w-28 h-28">
            <CircularProgressbar
              value={growthPercent}
              text={`${growthPercent}%`}
              styles={buildStyles({
                textColor: "#000000",         // Black text
    pathColor: "#facc15",         // Yellow path (Tailwind's yellow-400)
    trailColor: "#fef9c3",  
              })}
            />
          </div>

          {/* Line Chart */}
          <div className="h-56 bg-white border rounded-lg p-2 shadow w-full max-w-md">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis
                    tickFormatter={(val) => `₹${val}`}
                    fontSize={10}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip formatter={(val) => `₹${val}`} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 mt-16">Chart will appear after calculation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

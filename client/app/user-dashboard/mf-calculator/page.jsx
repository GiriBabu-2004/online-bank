"use client";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

export default function MutualFundCalculator() {
  const [mode, setMode] = useState("sip"); // sip or lumpsum
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("");
  const [yearlySetup, setYearlySetup] = useState(""); // optional
  const [inflationRate, setInflationRate] = useState(""); // optional
  const [finalAmount, setFinalAmount] = useState(null);
  const [chartData, setChartData] = useState([]);

  function calculateLumpsum(P, r, t, inflation) {
    let R = r / 100;
    if (inflation) R = R - inflation / 100;
    return P * Math.pow(1 + R, t);
  }

  function calculateSIP(P, r, n, inflation) {
    let R = r / 100 / 12;
    if (inflation) R = R - inflation / 100 / 12;
    return P * ((Math.pow(1 + R, n) - 1) / R) * (1 + R);
  }

  function calculate() {
    if (!amount || !interestRate || !years) {
      alert("Please fill amount, interest rate, and years");
      return;
    }

    const P = parseFloat(amount);
    const r = parseFloat(interestRate);
    const t = parseFloat(years);
    const yearly = yearlySetup ? parseFloat(yearlySetup) : 0;
    const infl = inflationRate ? parseFloat(inflationRate) : 0;

    let corpus = 0;
    let invested = 0;

    if (mode === "lumpsum") {
      corpus = calculateLumpsum(P, r, t, infl);
      invested = P + yearly * t;
      if (yearly > 0) {
        let R = (r - infl) / 100;
        const yearlyFV = yearly * ((Math.pow(1 + R, t) - 1) / R);
        corpus += yearlyFV;
      }
    } else {
      const months = t * 12;
      corpus = calculateSIP(P, r, months, infl);
      invested = P * months + yearly * t;
      if (yearly > 0) {
        let R = (r - infl) / 100;
        const yearlyFV = yearly * ((Math.pow(1 + R, t) - 1) / R);
        corpus += yearlyFV;
      }
    }

    setFinalAmount(corpus.toFixed(2));

    // Chart data for corpus growth over years
    const data = [];
    for (let i = 0; i <= t; i++) {
      let val = 0;
      if (mode === "lumpsum") {
        val =
          calculateLumpsum(P, r, i, infl) +
          yearly * (((Math.pow(1 + (r - infl) / 100, i) - 1) / ((r - infl) / 100)) || 0);
      } else {
        val = calculateSIP(P, r, i * 12, infl) + yearly * (((Math.pow(1 + (r - infl) / 100, i) - 1) / ((r - infl) / 100)) || 0);
      }
      data.push({ year: `Y${i}`, amount: parseFloat(val.toFixed(2)) });
    }
    setChartData(data);
  }

  const principalFloat =
    mode === "sip"
      ? (parseFloat(amount) || 0) * (parseFloat(years) || 0) * 12 +
        (parseFloat(yearlySetup) || 0) * (parseFloat(years) || 0)
      : (parseFloat(amount) || 0) + (parseFloat(yearlySetup) || 0) * (parseFloat(years) || 0);

  const interestEarned =
    finalAmount && principalFloat ? (finalAmount - principalFloat).toFixed(2) : "0.00";

  const pieData = [
    { name: "Invested Amount", value: principalFloat, color: "#3b82f6" }, // blue
    { name: "Returns Earned", value: finalAmount ? finalAmount - principalFloat : 0, color: "#22c55e" }, // green
  ];

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
          <h2 className="text-3xl font-bold text-yellow-800 text-center">Mutual Fund Calculator</h2>

          <div className="mb-4">
            <label className="mr-4 font-semibold">Mode:</label>
            <label className="mr-4">
              <input
                type="radio"
                checked={mode === "sip"}
                onChange={() => setMode("sip")}
              />{" "}
              SIP
            </label>
            <label>
              <input
                type="radio"
                checked={mode === "lumpsum"}
                onChange={() => setMode("lumpsum")}
              />{" "}
              Lumpsum
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label>{mode === "sip" ? "Monthly SIP Amount (₹)" : "Lumpsum Amount (₹)"}</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label>Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter expected return rate"
              />
            </div>

            <div>
              <label>Maturity Terms  (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter number of years"
              />
            </div>

            <div>
              <label>
                Yearly Setup Amount (₹) <small className="text-gray-500">(Optional)</small>
              </label>
              <input
                type="number"
                value={yearlySetup}
                onChange={(e) => setYearlySetup(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Additional yearly setup"
              />
            </div>

            <div>
              <label>
                Inflation Rate (%) <small className="text-gray-500">(Optional)</small>
              </label>
              <input
                type="number"
                step="0.01"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter inflation rate"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-yellow-500 text-white cursor-pointer py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Result and Visualization */}
        <div className="space-y-6 flex flex-col justify-center items-center">
          {/* Result Box */}
          <div className="bg-green-50 border border-green-300 rounded-xl p-4 w-full max-w-md space-y-2 text-center">
            <p className="text-lg font-semibold text-green-700">
              Estimated Corpus: ₹{finalAmount ? parseFloat(finalAmount).toLocaleString() : "0"}
            </p>
            <p className="text-md text-green-700">
              Invested Amount: ₹{principalFloat.toFixed(2)}
            </p>
            <p className="text-md text-green-700">
              Returns Earned: ₹{interestEarned}
            </p>
          </div>

          {/* Pie Chart */}
<div className="w-40 h-40 -mt-8">
  {finalAmount ? (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          paddingAngle={5}
          
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-center text-gray-400 mt-20">
      Pie chart will appear after calculation
    </p>
  )}
</div>

{/* Percentages under the Pie Chart */}
{finalAmount && (
  <div className="flex justify-center gap-6 mt-0.5 text-sm font-medium">
    <div className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: pieData[0].color }}
      ></span>
      <span>
        Invested: {((pieData[0].value / finalAmount) * 100).toFixed(1)}%
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: pieData[1].color }}
      ></span>
      <span>
        Returns: {((pieData[1].value / finalAmount) * 100).toFixed(1)}%
      </span>
    </div>
  </div>
)}



          {/* Line Chart */}
          <div className="h-56 bg-white border rounded-lg p-2 shadow w-full max-w-md">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="year" fontSize={10} />
                  <YAxis
                    tickFormatter={(val) => `₹${val.toLocaleString()}`}
                    fontSize={10}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
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

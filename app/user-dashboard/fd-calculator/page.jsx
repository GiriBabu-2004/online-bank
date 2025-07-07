"use client";
import { useState } from "react";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState("years"); // years or months
  const [compounding, setCompounding] = useState("yearly"); // compounding frequency
  const [maturityAmount, setMaturityAmount] = useState(null);

  // Map compounding frequency to number of times compounded per year
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
    let n = compoundingMap[compounding];
    let t = parseFloat(tenure);

    // Convert tenure to years if tenureType is months
    if (tenureType === "months") {
      t = t / 12;
    }

    // Compound interest formula: A = P(1 + R/n)^(nt)
    const A = P * Math.pow(1 + R / n, n * t);
    setMaturityAmount(A.toFixed(2));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">FD Calculator</h2>
      <div className="space-y-3">
        <div>
          <label>Principal Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter principal amount"
          />
        </div>
        <div>
          <label>Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter interest rate"
          />
        </div>
        <div>
          <label>Tenure</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter tenure"
          />
          <select
            value={tenureType}
            onChange={(e) => setTenureType(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </div>
        <div>
          <label>Compounding Frequency</label>
          <select
            value={compounding}
            onChange={(e) => setCompounding(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="yearly">Yearly</option>
            <option value="halfYearly">Half-Yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button
          onClick={calculateMaturity}
          className="w-full bg-blue-600 text-white rounded py-2 mt-4"
        >
          Calculate
        </button>
      </div>

      {maturityAmount && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <p><strong>Maturity Amount:</strong> ₹{maturityAmount}</p>
          <p>
            <strong>Interest Earned:</strong> ₹{(maturityAmount - principal).toFixed(2)}
          </p>
        </div>
      )}
    </div>
    </div>
  );
}

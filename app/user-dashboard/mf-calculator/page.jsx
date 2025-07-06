"use client";
import { useState } from "react";

export default function MutualFundCalculator() {
  const [mode, setMode] = useState("sip"); // sip or lumpsum
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("");
  const [yearlySetup, setYearlySetup] = useState(""); // optional
  const [inflationRate, setInflationRate] = useState(""); // optional
  const [finalAmount, setFinalAmount] = useState(null);

  // Calculate future value of lumpsum investment
  function calculateLumpsum(P, r, t, inflation) {
    let R = r / 100;
    if (inflation) R = R - inflation / 100;
    return P * Math.pow(1 + R, t);
  }

  // Calculate future value of SIP investment
  // Formula: FV = P * [ ( (1 + r)^n - 1 ) / r ] * (1 + r)
  function calculateSIP(P, r, n, inflation) {
    let R = r / 100 / 12; // monthly rate
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

    if (mode === "lumpsum") {
      corpus = calculateLumpsum(P, r, t, infl);

      if (yearly > 0) {
        // Add future value of yearly setup amount (annuity)
        // FV = A * [ ((1 + r)^t - 1) / r ]
        let R = (r - infl) / 100;
        const yearlyFV = yearly * ((Math.pow(1 + R, t) - 1) / R);
        corpus += yearlyFV;
      }
    } else {
      // SIP mode
      const months = t * 12;
      corpus = calculateSIP(P, r, months, infl);

      if (yearly > 0) {
        // Add yearly setup lumpsum with compounding yearly
        let R = (r - infl) / 100;
        const yearlyFV = yearly * ((Math.pow(1 + R, t) - 1) / R);
        corpus += yearlyFV;
      }
    }

    setFinalAmount(corpus.toFixed(2));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Mutual Fund Calculator</h2>

      <div className="mb-4">
        <label className="mr-4 font-semibold">Mode:</label>
        <label className="mr-2">
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
            className="w-full border rounded px-2 py-1"
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
            className="w-full border rounded px-2 py-1"
            placeholder="Enter expected return rate"
          />
        </div>

        <div>
          <label>Tenure (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter number of years"
          />
        </div>

        <div>
          <label>Yearly Setup Amount (₹) <small className="text-gray-500">(Optional)</small></label>
          <input
            type="number"
            value={yearlySetup}
            onChange={(e) => setYearlySetup(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Additional yearly sip only"
          />
        </div>

        <div>
          <label>Inflation Rate (%) <small className="text-gray-500">(Optional)</small></label>
          <input
            type="number"
            step="0.01"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter inflation rate"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-600 text-white rounded py-2 mt-4"
        >
          Calculate
        </button>
      </div>

      {finalAmount && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <p><strong>Estimated Corpus:</strong> ₹{finalAmount}</p>
          <p><strong>Estimated Returns:</strong> ₹{(finalAmount - (mode === "sip" ? amount * years * 12 : amount)).toFixed(2)}</p>
        </div>
      )}
    </div>
    </div>
  );
}

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
  import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";

  export default function MutualFundCalculator() {
    const [mode, setMode] = useState("sip");
    const [amount, setAmount] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [years, setYears] = useState("");
    const [yearlySetup, setYearlySetup] = useState("");
    const [inflationRate, setInflationRate] = useState("");
    const [finalAmount, setFinalAmount] = useState(0);
    const [chartData, setChartData] = useState([]);

    function calculateLumpsum(P, r, t, infl) {
      let R = r / 100 - infl / 100;
      return P * Math.pow(1 + R, t);
    }

    function calculateSIP(P, r, months, infl) {
      let R = r / 100 / 12 - infl / 100 / 12;
      return P * ((Math.pow(1 + R, months) - 1) / R) * (1 + R);
    }

    function calculate() {
      const P = parseFloat(amount);
      const r = parseFloat(interestRate);
      const t = parseFloat(years);
      const yearly = parseFloat(yearlySetup) || 0;
      const infl = parseFloat(inflationRate) || 0;

      if (!P || !r || !t) {
        alert("Please fill positive amount, rate, and years");
        return;
      }

      let corpus = 0;
      const investedBase = mode === "sip" ? P * t * 12 : P;
      const months = t * 12;

      if (mode === "lumpsum") {
        corpus = calculateLumpsum(P, r, t, infl);
        if (yearly) {
          const R = r / 100 - infl / 100;
          corpus += yearly * ((Math.pow(1 + R, t) - 1) / R);
        }
      } else {
        corpus = calculateSIP(P, r, months, infl);
        if (yearly) {
          const R = r / 100 - infl / 100;
          corpus += yearly * ((Math.pow(1 + R, t) - 1) / R);
        }
      }

      setFinalAmount(parseFloat(corpus.toFixed(2)));

      // build chart
      const steps = mode === "sip" ? months : t * 1;
      const data = [];
      for (let i = 0; i <= steps; i += Math.ceil(steps / 20)) {
        const timeLabel = mode === "sip" ? `M${i}` : `Year ${i}`;
        const amt =
          mode === "sip"
            ? calculateSIP(P, r, i, infl) +
              (yearly
                ? yearly *
                  ((Math.pow(1 + (r / 100 - infl / 100), i / 12) - 1) /
                    (r / 100 - infl / 100))
                : 0)
            : calculateLumpsum(P, r, i / 12, infl) +
              (yearly
                ? yearly *
                  ((Math.pow(1 + (r / 100 - infl / 100), i / 12) - 1) /
                    (r / 100 - infl / 100))
                : 0);
        data.push({ time: timeLabel, amount: parseFloat(amt.toFixed(0)) });
      }
      setChartData(data);
    }

    const invested =
      mode === "sip"
        ? parseFloat(amount || "0") * parseFloat(years || "0") * 12
        : parseFloat(amount || "0");
    const totalInvested =
      invested + (parseFloat(yearlySetup) || 0) * parseFloat(years || "0");
    const interestEarned = (finalAmount - totalInvested).toFixed(2);
    const growthPercent = totalInvested
      ? Math.min(
          100,
          (((finalAmount - totalInvested) / totalInvested) * 100).toFixed(1)
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
            <h2 className="text-3xl font-bold text-yellow-800 text-center">
              Mutual Fund Calculator
            </h2>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={mode === "sip"}
                    onChange={() => setMode("sip")}
                  />
                  SIP
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={mode === "lumpsum"}
                    onChange={() => setMode("lumpsum")}
                  />
                  Lumpsum
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                {mode === "sip" ? "Monthly SIP Amount (₹)" : "Lumpsum Amount (₹)"}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Expected return rate"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Maturity Terms (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Investment duration (yrs)"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Yearly Setup Amount (₹){" "}
                <span className="text-sm text-gray-500">(optional)</span>
              </label>
              <input
                type="number"
                value={yearlySetup}
                onChange={(e) => setYearlySetup(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Annual top-up"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Inflation Rate (%){" "}
                <span className="text-sm text-gray-500">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Inflation rate"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Calculate
            </button>
          </div>

          {/* Result & Visualization */}
          <div className="space-y-6 flex flex-col justify-center items-center">
            <div className="bg-green-100 border border-green-300 rounded-xl p-4 w-full max-w-md space-y-2 text-center">
              <p className="text-lg font-semibold text-green-800">
                Estimated Corpus: ₹{finalAmount.toLocaleString()}
              </p>
              <p className="text-lg text-green-700">
                Invested Amount: ₹{totalInvested.toFixed(2)}
              </p>
              <p className="text-lg text-green-700">
                Returns Earned: ₹{interestEarned}
              </p>
            </div>

            <div className="w-28 h-28">
              <CircularProgressbar
                value={growthPercent}
                text={`${growthPercent}%`}
                styles={buildStyles({
                  textColor: "#000",
                  pathColor: "#facc15",
                  trailColor: "#fef9c3",
                })}
              />
            </div>

            <div className="h-56 bg-white border rounded-lg p-2 shadow w-full max-w-md">
              {chartData.length ? (
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
                <p className="text-center text-gray-400 mt-16">
                  Chart will appear after calculation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

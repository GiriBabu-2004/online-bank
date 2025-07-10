"use client";
import { useState } from "react";
import { WarpBackground } from "./magicui/warp-background";
import { ArrowLeft, ArrowRight, Expand, Rocket, Wrench, ShieldCheck, } from "lucide-react";
import Image from "next/image";
const testimonials = [
  {
    message:
      "Using this banking platform helped us improve our digital banking experience and build trust with our customers.",
    name: "Priya Shah",
    title: "Founder, FinTrust",
    image: "/priyatestimoni.png",
  },
  {
    message:
      "The security and ease of use are unmatched. This platform truly supports our growth at scale.",
    name: "Rahul Verma",
    title: "CTO, SecureBank",
    image: "/rahultestimoni.png",
  },
  {
    message:
      "With Liveblocks integrated, we saved weeks of engineering time while improving our product reliability.",
    name: "Anita Kulkarni",
    title: "Product Head, NeoPay",
    image: "/anitatestimoni.png",
  },
];
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { name: 'Jan', users: 3000, rooms: 500 },
  { name: 'Feb', users: 4000, rooms: 800 },
  { name: 'Mar', users: 4700, rooms: 1200 },
  { name: 'Apr', users: 5200, rooms: 1500 },
  { name: 'May', users: 6200, rooms: 1700 },
  { name: 'Jun', users: 7500, rooms: 1990 },
  { name: 'Jul', users: 12000, rooms: 2200 },
];


export default function JourneySection() {
  const [current, setCurrent] = useState(0);
  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const testimonial = testimonials[current];
  return (
    <div className="bg-white">
      {/* Wavy SVG Top */}
      <div className="-mt-60 relative z-50">
        <svg
          className="w-full "
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#facc15" // yellow-400
            d="M0,160 C360,80 1080,240 1440,160 L1440,320 L0,320 Z"
          />
        </svg>
      </div>


      {/* Journey Section */}
      <section id="our-journey" className=" flex py-20 bg-[#facc15] -mt-15 items-center justify-center">
        <WarpBackground className=" max-w-6xl p-3 bg-black relative rounded-md  z-0">
          <div className="max-w-6xl bg-white/99 rounded-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="kanit text-3xl font-bold text-gray-800 mb-8 text-center pt-10">
              WHERE YOUR MONEY FEELS SAFE
            </h2>
            <div className="relative z-10 space-y-12">

              {/* Header */}
              <div className="text-center">
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                  Behind every feature is a <strong>battle-tested platform</strong> built for
                  performance, security, and trust—made for modern banking experiences.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-2">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute right-0 bottom-0 w-48 h-48 bg-white blur-2xl rounded-full opacity-40 z-0 pointer-events-none"></div>

                  {/* Card */}
                  <div className="relative z-10 p-6 rounded-tl-lg border border-gray-200 shadow-sm bg-white">
                    <h3 className="font-semibold text-gray-900 text-md">
                      Monitoring Dashboard
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                      Track transactions, activity logs, and customer insights in real time.
                    </p>

                    {/* Chart */}
                    <div className="h-[220px] w-[330px] mt-10 ml-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#2563eb"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="rooms"
                            stroke="#f59e0b"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>


                <div className="p-6 rounded-tr-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-md">
                    Real-Time Infrastructure
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    Robust WebSocket-based backend for live balance updates and instant alerts.
                  </p>
                  <div className="mt-4 bg-gradient-to-tr from-yellow-300 to-yellow-100 h-32 rounded-lg" />
                </div>
              </div>

              {/* Testimonial */}

              <div className="relative border border-gray-200 p-6 mb-1 -mt-12 shadow-sm bg-white">
                {/* Navigation Arrows */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-md hover:bg-gray-100 transition border border-gray-200"
                  >
                    <ArrowLeft size={18} className="text-gray-800" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-md hover:bg-gray-100 transition border border-gray-200"
                  >
                    <ArrowRight size={18} className="text-gray-800" />
                  </button>
                </div>

                {/* Logo Section */}
                <div>
                  <Image
                    src="/logo2nd1.png"
                    alt="Bank Logo Light"
                    width={230}
                    height={60}
                    className="object-contain -mt-1 block dark:hidden transition-all scale-70"
                  />
                  <Image
                    src="/logo2nd2.png"
                    alt="Bank Logo Dark"
                    width={230}
                    height={60}
                    className="object-contain mt-2 hidden dark:block transition-all scale-70"
                  />
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 text-lg mt-4 ml-7">
                  “<span className="font-semibold text-gray-900">{
                    testimonial.message.split(" ")[0] + " " + testimonial.message.split(" ")[1]
                  }</span>{" "}
                  {testimonial.message.split(" ").slice(2).join(" ")}”
                </p>

                {/* User Info */}
                <div className="mt-4 flex items-center gap-4 ml-7">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full scale-130"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
              </div>



              {/* Four Feature Highlights */}
              <div className="grid md:grid-cols-2 -mt-1 gap-px bg-gray-100">
                {/* Card 1 */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm">
                  <Expand className="text-blue-700 mb-4" size={24} />
                  <h4 className="font-semibold text-gray-800">Effortless Scaling</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Easily manage growing traffic and users with cloud-native performance.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm">
                  <Rocket className="text-yellow-500 mb-4" size={24} />
                  <h4 className="font-semibold text-gray-800">Minimal Setup</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Get started quickly with our modular and easy-to-integrate APIs.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm">
                  <Wrench className="text-gray-700 mb-4" size={24} />
                  <h4 className="font-semibold text-gray-800">Zero Maintenance Worry</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Focus on building. We'll take care of updates and security.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm">
                  <ShieldCheck className="text-green-700 mb-4" size={24} />
                  <h4 className="font-semibold text-gray-800">Bank-Grade Security</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    End-to-end encryption and regulatory compliance from day one.
                  </p>
                </div>
              </div>
              <div className="bg-white text-balck -mt-15 pb-2 rounded-md border border-gray-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Uptime */} 
                <div>
                  <h2 className="text-4xl md:text-5xl font-semibold text-gray-200">
                    99.99<span className="align-super text-2xl">%</span> Uptime
                  </h2>
                </div>

                {/* Certifications */}
                <div className="flex items-center gap-6">
                </div>
              </div>

            </div>

          </div>
        </WarpBackground>
      </section>
    </div>
  );
}

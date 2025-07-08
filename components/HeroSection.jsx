import Link from "next/link";
import { WordRotate } from "./magicui/word-rotate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import Iphone from "@/components/magicui/Iphone"; // adjust path based on your project

export default function HeroSection() {
  return (
    <div className="bg-white">
      <section className="w-full bg-white py-20 mt-5 px-4 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center">
        {/* Headline */}
        <div className=" -mt-18">
          <Link
            href=""
            className="inline-flex items-center gap-2 rounded-full border border-[#ddd9ec] px-4 py-1 mb-6 text-sm font-medium text-black shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            <span className="text-l">👑</span>
            <AnimatedGradientText className="text-sm">
              Welcome to the Online Bank
            </AnimatedGradientText>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <h1 className="text-xl md:text-6xl font-bold text-gray-800 mb-4">
            Your Financial Future,&nbsp;
            <WordRotate
              words={["Simplified", "Effortless", "Streamlined"]}
              className="text-yellow-500"
              duration={2500}
            />
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-md max-w-2xl mb-8 -mt-2">
            Join our modern digital bank designed to give you total control and
            security of your finances — anywhere, anytime.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-16 flex-wrap justify-center">
            {/* <button className="bg-black text-white px-6 py-3 rounded-lg cursor-pointer transition">
              Get Started
            </button> */}
            <Link href="/register">
              <button className="bg-black text-white px-6 py-3 rounded-lg cursor-pointer transition -mt-3">
                Open Account
              </button>
            </Link>
          </div>
          {/* iPhone Component */}
          <Iphone className="mx-auto -mt-6">
            <div className="h-full w-full bg-white flex flex-col overflow-y-auto font-sans">
              {/* Header */}
              <div className="bg-yellow-400 rounded-t-[55px] px-6 pt-15 pb-6 flex items-center justify-between relative">
                <i className="fas fa-arrow-left text-xl text-black" />
                <h2 className="text-lg font-semibold text-black">Banking</h2>
                <i className="fas fa-sliders-h text-xl text-black" />
              </div>

              {/* Cards */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center bg-white shadow rounded-xl p-4 border">
                  <div>
                    <p className="text-xs text-gray-500">Account Balance</p>
                    <p className="text-lg font-semibold">₹25,000</p>
                  </div>
                  <p className="text-right font-semibold text-gray-700">
                    ₹41,090
                  </p>
                </div>

                <div className="flex justify-between items-center bg-white shadow rounded-xl p-4 border">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <img src="https://img.icons8.com/fluency/24/online-money-transfer.png" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Siep Galaits</p>
                      <p className="text-sm font-semibold">₹1</p>
                    </div>
                  </div>
                  <p className="text-right font-semibold text-gray-700">
                    ₹22,090
                  </p>
                </div>

                <div className="flex justify-between items-center bg-white shadow rounded-xl p-4 border">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <img src="https://img.icons8.com/color/24/money--v1.png" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Transaction</p>
                      <p className="text-sm font-semibold">₹41,000</p>
                    </div>
                  </div>
                  <p className="text-right font-semibold text-gray-700">
                    ₹34,090
                  </p>
                </div>
              </div>

              {/* Transaction History */}
              <div className="px-4 mt-2">
                <h3 className="text-sm text-gray-600 mb-2">
                  Transaction History
                </h3>

                <div className="bg-black text-white rounded-xl p-4 mb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs">Account Balance</p>
                      <p className="text-sm font-semibold">₹21</p>
                    </div>
                    <p className="text-sm font-semibold">₹21,090</p>
                  </div>
                  <div className="mt-2 h-1 bg-yellow-400 rounded-full w-1/3" />
                </div>

                <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <img src="https://img.icons8.com/ios-filled/20/repeat.png" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Repeetion Payment</p>
                      <p className="text-xs text-gray-400">जॉग</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">₹7.00</p>
                </div>
              </div>

              {/* Button */}
              <div className="px-4 mt-auto mb-4">
                <button className="w-full bg-yellow-400 text-white font-bold py-3 rounded-full shadow">
                  Banking
                </button>
              </div>
            </div>
          </Iphone>
        </div>

        {/* Why Choose Us - placed at bottom */}
        {/* <div className="bg-yellow-50 p-6 rounded-xl shadow-md max-w-xl w-full">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">
            Why Choose Us?
          </h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
                alt="Security"
                className="w-8 h-8"
              />
              <span className="text-gray-700 text-sm">Top-notch Security</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/545/545682.png"
                alt="Fast"
                className="w-8 h-8"
              />
              <span className="text-gray-700 text-sm">Instant Transfers</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt="Support"
                className="w-8 h-8"
              />
              <span className="text-gray-700 text-sm">24/7 Support</span>
            </div>
          </div>
        </div> */}

        {/* Scroll prompt (optional) */}
        {/* <div className="text-center mt-12">
          <a href="#our-journey" className="text-blue-600 hover:underline">
            ↓ Scroll Down to See Our Journey
          </a>
        </div> */}
      </section>
    </div>
  );
}

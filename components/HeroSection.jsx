import Link from "next/link";
import { WordRotate } from "./magicui/word-rotate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

export default function HeroSection() {
  return (
    <div className="bg-white">
      <section className="w-full bg-white py-20 px-4 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center">
        {/* Headline */}
        <div className="pt-10 pb-10">
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
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
            Your Financial Future,&nbsp;
            <WordRotate
              words={["Simplified", "Effortless", "Streamlined"]}
              className="text-yellow-500"
              duration={2500}
            />
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-lg max-w-2xl mb-8">
            Join our modern digital bank designed to give you total control and
            security of your finances — anywhere, anytime.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-16 flex-wrap justify-center">
            <button className="bg-black text-white px-6 py-3 rounded-lg cursor-pointer transition">
              Get Started
            </button>
            <Link href="/register">
              <button className="border border-black text-black px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                Open Account
              </button>
            </Link>
          </div>
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
        <div className="text-center mt-12">
          <a href="#our-journey" className="text-blue-600 hover:underline">
            ↓ Scroll Down to See Our Journey
          </a>
        </div>
      </section>
    </div>
  );
}

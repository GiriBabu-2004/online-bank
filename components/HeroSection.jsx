import Link from "next/link";

// components/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-12 lg:px-24">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2">
          <img
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dbank&psig=AOvVaw3VbgNqMsSgqVL-30zBW1yn&ust=1751470081157000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPDRzNL8m44DFQAAAAAdAAAAABAE"
            alt="Online banking"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side - Text & CTA */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Smart Banking, Simplified.
          </h1>
          <p className="text-gray-600 text-lg">
            Join our modern digital bank designed to give you total control and security of your finances — anywhere, anytime.
          </p>

          {/* Card Section */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Why Choose Us?</h2>
            <div className="flex items-center gap-6 flex-wrap">
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
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
            <Link href={"/register"}>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
              Open Account
            </button>
            </Link>
            <a href="#about-us" className="text-blue-500 underline self-center">
              About Us
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Prompt */}
      <div className="text-center mt-20">
        <a href="#our-journey" className="text-blue-600 hover:underline">
          ↓ Scroll Down to See Our Journey
        </a>
      </div>
    </section>
  );
}

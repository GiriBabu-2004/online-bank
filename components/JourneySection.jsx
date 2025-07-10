export default function JourneySection() {
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
      <section id="our-journey" className="py-20 bg-[#facc15] -mt-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Journey
          </h2>

          <div className="space-y-10">
            {/* Timeline Item 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
                  alt="Founding year"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold text-blue-700">
                  2020 – The Beginning
                </h3>
                <p className="text-gray-600 mt-2">
                  We started with a mission to provide banking access to
                  everyone, anytime, anywhere.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1622543692543-d1ff5e7db0da?auto=format&fit=crop&w=800&q=80"
                  alt="Growth"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold text-blue-700">
                  2022 – 1M+ Users
                </h3>
                <p className="text-gray-600 mt-2">
                  Rapid growth driven by innovative digital solutions and trust
                  of our customers.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1639747281164-4c7d55f2f362?auto=format&fit=crop&w=800&q=80"
                  alt="Future"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold text-blue-700">
                  2025 – What's Next?
                </h3>
                <p className="text-gray-600 mt-2">
                  We're building AI-powered financial tools to help customers
                  save, invest, and grow more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

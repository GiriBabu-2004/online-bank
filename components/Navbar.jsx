"use client"; // Required if using Next.js app directory

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ className = "" }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const borderClass = scrolled
    ? "border-b border-green-200/30 dark:border-green-200/30"
    : "border-b-0";

  return (
    <nav
      className={`bg-white text-black transition-all ${borderClass} ${className}`}
    >
      <div className="max-w-screen-xl h-14 mx-auto flex items-center justify-between font-[Caveat] px-4">
        {/* Logo: light and dark variants */}
        <div>
          <Link href="/" className="flex items-center">
            {/* Light Mode Logo */}
            <Image
              src="/logo2nd1.png"
              alt="Bank Logo Light"
              width={230}
              height={60}
              className="object-contain mt-2 block dark:hidden transition-all scale-70"
            />
            {/* Dark Mode Logo */}
            <Image
              src="/logo2nd2.png"
              alt="Bank Logo Dark"
              width={230}
              height={60}
              className="object-contain mt-2 hidden dark:block transition-all scale-70"
            />
          </Link>

        </div>

        {/* Nav Links */}
        <div
          className="hidden md:flex pr-22 space-x-10 text-lg -pt-5 -mt-1 text-black"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Link
            href="/"
            className="px-3 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/customer-care"
            className="px-3 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            Customer Care
          </Link>
          <Link
            href="/about"
            className="px-3 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            About Us
          </Link>
        </div>

        {/* Login Button */}
        <div>
          <Link href="/login">
            <button
              className="bg-black  text-white px-5 py-1 rounded-md border-2 border-white hover:bg-white hover:text-black hover:border-black cursor-pointer transition-all font-semibold -mt-1"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

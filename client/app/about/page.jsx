'use client';
import { motion } from 'framer-motion';
import { Info, List, User, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { annotate } from 'rough-notation';
const sections = [
  {
    icon: Info,
    title: 'Who We Are',
    content: (
      <p>
        Founded in 2025, Online Bank is a digital-first bank committed to empowering people through smart financial services.
        Our team of fintech experts and customer advocates builds tools that put financial control back in your hands.
      </p>
    ),
  },
  {
    icon: List,
    title: 'What We Do',
    content: (
      <ul className="list-disc list-inside space-y-2 text-left">
        <li>Digital checking & savings accounts</li>
        <li>Real-time transfers and payments</li>
        <li>Smart budgeting and spending insights</li>
        <li>Loans with transparent terms</li>
        <li>24/7 support with a human touch</li>
      </ul>
    ),
  },
  {
    icon: User,
    title: 'Our Mission',
    content: (
      <p>
        To deliver seamless, secure, and inclusive financial services—designed for how people live and work today.
      </p>
    ),
  },
  {
    icon: AlertCircle,
    title: 'Our Values',
    content: (
      <ul className="list-disc list-inside space-y-2 text-left">
        <li>Transparency: No hidden fees or jargon</li>
        <li>Innovation: Built with tech, for people</li>
        <li>Security: Bank-grade protection</li>
        <li>Customer-First: Always listening, always improving</li>
      </ul>
    ),
  },
  {
    icon: CheckCircle,
    title: 'Why Choose Us',
    content: (
      <p>
        With 100% online access, transparent fees, and powerful tools to manage your finances,
        YourBank is designed for the future of banking. Join thousands who trust us to protect,
        grow, and simplify their money.
      </p>
    ),
  },
];

const AboutUs = () => {
     useEffect(() => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const el = document.getElementById('snippets');
    if (el) {
      setTimeout(() => {
        const annotation = annotate(el, {
          type: 'underline',
          color: 'black',
          animationDuration: 800,
          padding: 2,
        });
        annotation.show();
      }, 100);
    }
  }, []);
  return (
    <div className="w-full min-h-screen bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center "
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>
        <Link
                href="/"
                className="absolute top-5 left-5 z-50 flex items-center space-x-2"
              >
                <img src="tablogo.png" alt="Logo" className="h-10  w-auto" />
                <img src="logo2nd1.png" alt="Logo" className="h-10 mt-1 w-auto" />
              </Link>
    <div className=" text-gray-800 px-6 py-16 max-w-3xl mx-auto">
      {/* === Heading === */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Welcome to{' '} <span id='snippets' className="text-yellow-500 text-xl font-semibold">Online Bank</span>,</p><p className='mt-2'>we're redefining banking for the digital age. Built with innovation, security, and customer experience at our core, we make managing your money simpler, smarter, and more accessible—wherever life takes you.</p> 
        
      </motion.div>

      {/* === Vertical Timeline === */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

        <div className="space-y-20">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center px-4"
            >
              {/* Icon Bubble */}
              <div className="z-10 bg-white border-4 border-yellow-500 rounded-full p-3 shadow-md mb-4">
                <section.icon className="text-yellow-600" size={24} />
              </div>

              {/* Box with Content */}
              <div className="bg-white/80 border border-yellow-400 rounded-xl shadow-md p-6 max-w-xl w-full">
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <div className="text-base text-gray-700">{section.content}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutUs;

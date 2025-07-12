import Link from 'next/link';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-yellow-400 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-yellow-600 pb-8">

        {/* About */}
        <div className="transition-transform duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wide">About Online Bank</h3>
          <p className="text-sm text-yellow-200 leading-relaxed">
            Online Bank is your trusted financial partner, offering secure and modern banking solutions for individuals and businesses.
          </p>
        </div>

        {/* Quick Links */}
        <div className="transition-transform duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/login', label: 'Login' },
              { href: '/register', label: 'Register' },
              { href: '/customer-care', label: 'Customer Support' },
              { href: '/forgot-password', label: 'Forgot Password' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-yellow-400 hover:text-yellow-200 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="transition-transform duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wide">Contact Us</h3>
          <ul className="text-sm space-y-2 text-yellow-200">
            <li>Email: support@bankx.com</li>
            <li>Phone: +1 800 123 4567</li>
            <li>Address: 123 Finance St, NY, USA</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="transition-transform duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wide">Follow Us</h3>
          <div className="flex space-x-4">
            {[{
              href: 'https://facebook.com',
              icon: <FaFacebookF />,
            }, {
              href: 'https://twitter.com',
              icon: <FaTwitter />,
            }, {
              href: 'https://linkedin.com',
              icon: <FaLinkedinIn />,
            }, {
              href: 'https://instagram.com',
              icon: <FaInstagram />,
            }].map(({ href, icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-100 transition-transform transform hover:scale-110 text-xl"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-yellow-500 mt-6 animate-fadeIn">
        © {new Date().getFullYear()} Online Bank. All rights reserved.
      </div>
    </footer>
  );
}

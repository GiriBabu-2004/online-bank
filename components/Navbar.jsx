import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-300">
      <div className="max-w-8xl  mx-auto  px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center h-20"> {/* increased height for larger logo */}
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image
                src="/bank-logo.png"
                alt="Bank Logo"
                width={250}
                height={60} // you can tweak height if logo looks too tall
                className="object-contain mt-[-30px]" 
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/customer-care" className="hover:text-blue-600 transition">Customer Care</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
            <Link href="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

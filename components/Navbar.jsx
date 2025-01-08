"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative bg-white shadow-md z-50">

      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png" // আপনার লোগো ফাইল পাথ
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold">MyApp</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/photos" className="hover:text-blue-500">
            Photos
          </Link>
          <Link href="https://www.youtube.com/" className="hover:text-blue-500">
            Contact
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="z-50 md:hidden bg-gray-100 p-4 space-y-2 w-[300px] absolute right-0 top-full shadow-lg">
            <Link href="/" className="block hover:text-blue-500">
            Home
            </Link>
            <Link href="/photos" className="block hover:text-blue-500">
            Photos
            </Link>
            <Link href="/contact" className="block hover:text-blue-500">
            Contact
            </Link>
        </div>
        )}


    </nav>
  );
};

export default Navbar;

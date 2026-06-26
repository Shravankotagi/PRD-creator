"use client";
import Link from "next/link";
import { useState } from "react";
import BrandLogo from "../BrandLogo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <BrandLogo href="/" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[18px] text-gray-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[18px] text-gray-600 hover:text-blue-700 font-semibold transition-colors"
            >
              How It Works
            </a>
            <a
              href="#demo"
              className="text-[18px] text-gray-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Demo
            </a>
            <a
              href="#faq"
              className="text-[18px] text-gray-600 hover:text-blue-700 font-semibold transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-[15px] bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-700/10 flex items-center gap-1"
            >
              Sign In
            </Link>
            
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 space-y-4 shadow-inner">
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block text-base text-gray-700 font-semibold py-2 hover:text-blue-700"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-base text-gray-700 font-semibold py-2 hover:text-blue-700"
          >
            How It Works
          </a>
          <a
            href="#demo"
            onClick={() => setMobileOpen(false)}
            className="block text-base text-gray-700 font-semibold py-2 hover:text-blue-700"
          >
            Demo
          </a>
          <a
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="block text-base text-gray-700 font-semibold py-2 hover:text-blue-700"
          >
            FAQ
          </a>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="block text-center text-blue-700 border border-blue-600 hover:bg-blue-50 py-2.5 rounded-xl font-bold"
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="block text-center bg-blue-700 text-white py-2.5 rounded-xl font-bold hover:bg-blue-800"
            >
              Try Demo →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
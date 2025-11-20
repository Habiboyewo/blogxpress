"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-600 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-gray-100 text-2xl mb-3">
            {" "}
            Blog<span className="text-blue-500">Xpress</span>
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            A modern platform where anyone can write, share, and discover
            stories.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100 text-lg mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-100">
            <li>
              <Link href="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard/create" className="hover:text-blue-500">
                Write a Story
              </Link>
            </li>
            <li>
              <Link href="/#" className="hover:text-blue-500">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100 text-lg mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-50">
            <li>
              <Link href="#" className="hover:text-blue-500">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="text-center text-xs text-gray-50 py-4">
          © {new Date().getFullYear()} BlogXpress — All rights reserved.
        </p>
      </div>
    </footer>
  );
}

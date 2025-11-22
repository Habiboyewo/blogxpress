"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { buttonVariants } from "../ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="py-5 border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Blog<span className="text-blue-500">Xpress</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors pb-1
                    ${isActive ? "text-blue-500" : "text-gray-700 hover:text-blue-500"}
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Hi, {user.given_name || "there"}!
                </span>
                <LogoutLink className={buttonVariants({ variant: "secondary" })}>
                  Logout
                </LogoutLink>
              </>
            ) : (
              <>
                <LoginLink className={buttonVariants()}>Login</LoginLink>
                <RegisterLink className={buttonVariants({ variant: "secondary" })}>
                  Sign up
                </RegisterLink>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>


        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-6 pb-8">
            <div className="flex flex-col gap-8">

              {user && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {user.given_name?.[0]?.toUpperCase() || "G"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-md">Welcome {user.given_name || "Guest"}!</p>
                    </div>
                  </div>

                  <LogoutLink
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logout
                  </LogoutLink>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors
                        ${isActive ? "text-blue-500" : "text-gray-700"}
                      `}
                    >
                      {link.label}
                      {isActive && <div className="h-0.5 bg-blue-500 mt-1 rounded-full" />}
                    </Link>
                  );
                })}
              </div>

              {!user && (
                <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
                  <LoginLink
                    className={buttonVariants({ size: "lg" })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </LoginLink>
                  <RegisterLink
                    className={buttonVariants({ variant: "secondary", size: "lg" })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </RegisterLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
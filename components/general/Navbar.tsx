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

export function Navbar() {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const pathname = usePathname(); 

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="text-3xl font-semibold">
            Blog<span className="text-blue-500">Xpress</span>
          </h1>
        </Link>
      </div>

      <div className="hidden sm:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors 
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

      {user ? (
        <div className="flex items-center gap-4">
          <p className="font-medium pt-2">{user.given_name}</p>
          <LogoutLink className={buttonVariants({ variant: "secondary" })}>
            Logout
          </LogoutLink>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <LoginLink className={buttonVariants()}>Login</LoginLink>
          <RegisterLink className={buttonVariants({ variant: "secondary" })}>
            Sign up
          </RegisterLink>
        </div>
      )}
    </nav>
  );
}

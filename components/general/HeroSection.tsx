"use client";

import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function HeroSection() {
  const { user, isAuthenticated } = useKindeBrowserClient();

  return (
    <section
      className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: "url('/heroImage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Share Your Voice.{" "}
          <br /><span className="text-blue-400 ">Inspire The World.</span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-md">
          A space to write, read, and discover amazing stories from people like you.
        </p>

        <Link
          href={isAuthenticated ? "/dashboard/create" : "/api/auth/login"}
          className="mt-8 inline-block px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
        >
          {isAuthenticated ? "Write a Story" : "Get Started"}
        </Link>
      </div>
    </section>
  );
}



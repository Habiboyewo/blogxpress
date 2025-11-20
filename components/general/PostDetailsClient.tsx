"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/Avatar";
import Image from "next/image";
import prisma from "@/app/utils/db";
import type { BlogPost as BlogPostType } from "@prisma/client";



interface PostDetailClientProps {
  post: BlogPostType;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/"; 

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Link
          href={from}
          className={buttonVariants({ variant: "secondary" }) + " text-sm"}
        >
          ← Back to posts
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-800">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="relative flex items-center space-x-2 h-10">
            <Avatar src={post.authorImage} alt={post.authorName || "Anonymous"} />
            <p className="font-semibold">{post.authorName}</p>
          </div>
          <span className="text-sm">
            {new Intl.DateTimeFormat("en-UK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(post.createdAt)}
          </span>
        </div>
      </div>

      <div className="relative w-full h-96 sm:h-[400px] mb-10 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-full text-gray-800">
        <p>{post.content}</p>
      </div>
    </div>
  );
}

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import prisma from "../utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { BlogPostCard } from "@/components/general/BlogpostCard";
import { redirect } from "next/navigation";
import PaginationControls from "@/components/ui/PaginationControl";
import { FilePenIcon, Sparkles } from "lucide-react";

export const revalidate = 30;
const POSTS_PER_PAGE = 12;

async function getPaginatedUserPosts(userId: string, page: number) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const posts = await prisma.blogPost.findMany({
    where: { authorId: userId },
    skip,
    take: POSTS_PER_PAGE,
    orderBy: { createdAt: "desc" },
  });

  const totalPosts = await prisma.blogPost.count({
    where: { authorId: userId },
  });

  return { posts, totalPosts };
}

export default async function DashboardRoute({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect("/api/auth/login");

  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const { posts, totalPosts } = await getPaginatedUserPosts(user.id, page);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const hasPosts = posts.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Blog Articles</h1>
        <Link
          href="/dashboard/create"
          className={buttonVariants({
            size: "default", 
            className: "px-6 py-3 text-sm md:text-base md:px-8 md:py-4",
          })}
        >
          <FilePenIcon className=" h-3 w-4" />
          Write a post
        </Link>
      </div>

      {!hasPosts && (
        <div className="text-center py-14">
          <div className="mx-auto mb-8 w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            No posts yet — time to change that!
          </h2>

          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            Share your first story with the world and start
            building your audience.
          </p>

          <Link
            href="/dashboard/create"
            className={buttonVariants({ size: "lg", className: "shadow-lg" })}
          >
            <FilePenIcon className="mr-2 h-5 w-5" />
            Write Your First Post
          </Link>
        </div>
      )}

      {hasPosts && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <BlogPostCard key={post.id} data={post} from="/dashboard" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                basePath="/dashboard"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

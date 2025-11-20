import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import prisma from "../utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { BlogPostCard } from "@/components/general/BlogpostCard";
import { redirect } from "next/navigation";
import PaginationControls from "@/components/ui/PaginationControl";

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
  searchParams?: { page?: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect("/api/auth/login");

  const page = Number(searchParams?.page) || 1;
  const { posts, totalPosts } = await getPaginatedUserPosts(user.id, page);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mt-2 mb-8">
        <h2 className="text-xl font-medium">Your Blog Articles</h2>
        <Link className={buttonVariants()} href="/dashboard/create">
          Create post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-10">
        {posts.map((item) => (
          <BlogPostCard data={item} key={item.id} from="/dashboard" />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          basePath="/dashboard"
        />
      )}
    </div>
  );
}

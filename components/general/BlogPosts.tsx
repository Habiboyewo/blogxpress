import prisma from "@/app/utils/db";
import { BlogPostCard } from "./BlogpostCard";
import PaginationControls from "@/components/ui/PaginationControl";

const POSTS_PER_PAGE = 6;

async function getPaginatedPosts(page: number) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const posts = await prisma.blogPost.findMany({
    skip,
    take: POSTS_PER_PAGE,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      authorId: true,
      authorName: true,
      authorImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalPosts = await prisma.blogPost.count();

  return { posts, totalPosts };
}

export default async function BlogPosts({ page }: { page: number }) {
  const { posts, totalPosts } = await getPaginatedPosts(page);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-10">
        {posts.map((item) => (
          <BlogPostCard key={item.id} data={item} />
        ))}
      </div>
      <div className="pt-2">
        {totalPages > 1 && (
          <PaginationControls currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}

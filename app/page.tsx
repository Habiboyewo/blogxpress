import { Suspense } from "react";
import HeroSection from "@/components/general/HeroSection";
import BlogPosts from "@/components/general/BlogPosts";
import BlogSkeletonGrid from "@/components/ui/BlogSkeletonGrid";

export const revalidate = 30;


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  return (
    <div>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-1">
        <h1 className="text-3xl text-gray-800 font-bold tracking-tight mb-8">
          Latest Posts
        </h1>

        <Suspense fallback={<BlogSkeletonGrid />}>
          <BlogPosts page={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
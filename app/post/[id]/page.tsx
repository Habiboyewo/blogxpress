import prisma from "@/app/utils/db";
import PostDetailClient from "@/components/general/PostDetailsClient";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function IdPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params; 
  const data = await getData(id);

  return <PostDetailClient post={data} />;
}

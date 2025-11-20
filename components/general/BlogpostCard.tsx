import Image from "next/image";
import Link from "next/link";
import { getAuthorAvatar } from "@/app/utils/avatar";
import { Avatar } from "../ui/Avatar";

interface IappProps {
  data: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    authorId: string;
    authorName: string;
    authorImage: string;
    createdAt: Date;
    updatedAt: Date;
  };
  from?: string;
}
export function BlogPostCard({ data, from = "/" }: IappProps) {
  const authorAvatar = getAuthorAvatar(data.authorImage);

  return (
    <div className="group relative overflow-hidden rounded-lg border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
      <Link href={`/post/${data.id}?from=${from}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={data.imageUrl}
            alt="Image for blog"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-grey-900">
            {data.title}
          </h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {data.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative size-8 overflow-hidden rounded-full">
                {/* <Image
                  src={authorAvatar}
                  alt={data.authorName}
                  fill
                  className="object-cover"
                /> */}
                <Avatar
                  src={authorAvatar}
                  alt={data.authorName || "Anonymous"}
                />
              </div>
              <p className="text-sm font-medium text-gray-700 ">
                {data.authorName}
              </p>
            </div>
            <time className="text-xs text-gray-500">
              {new Intl.DateTimeFormat("en-UK", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(data.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </div>
  );
}

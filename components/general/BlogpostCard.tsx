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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex flex-col justify-between min-h-48">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
              {data.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{data.content}</p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative size-8 rounded-full overflow-hidden flex-shrink-0">
                <Avatar
                  src={authorAvatar}
                  alt={data.authorName || "Anonymous"}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
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

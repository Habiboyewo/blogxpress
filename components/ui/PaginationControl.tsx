"use client";

import Link from "next/link";

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath = "",
}: {
  currentPage: number;
  totalPages: number;
  basePath?: string;   
}) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="flex items-center justify-center space-x-4">

      <Link
        href={`${basePath}?page=${prevPage}`}
        className={`px-4 py-2 border rounded-md text-sm ${
          !prevPage ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        Previous
      </Link>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={`${basePath}?page=${nextPage}`}
        className={`px-4 py-2 border rounded-md text-sm ${
          !nextPage ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        Next
      </Link>
    </div>
  );
}

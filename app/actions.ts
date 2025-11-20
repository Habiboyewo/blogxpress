"use server";

import { z } from "zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ZOD SERVER VALIDATION
const serverSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  file: z.instanceof(File),
});

async function uploadToCloudinary(buffer: Buffer, folder = "BlogXpress") {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      }
    );
    stream.end(buffer);
  });
}

export async function handleSubmission(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/api/auth/register");

  const file = formData.get("file") as File;

  const parsed = serverSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    file,
  });

  if (!parsed.success) {
    const firstErrorMessage =
      parsed.error.issues[0]?.message || "Invalid input";
    throw new Error(firstErrorMessage);
  }

  // file validations
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("Image is too large. Maximum allowed size is 5MB.");
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploaded = await uploadToCloudinary(buffer, "BlogXpress");

  await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      imageUrl: uploaded.secure_url,
      authorId: user.id,
      authorImage: user.picture || "/blogxpressPlaceholder.png",
      authorName: user.given_name || "Anonymous",
    },
  });

  revalidatePath("/");
  redirect("/dashboard");
}

// "use server";

// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import prisma from "./utils/db";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

// export async function handleSubmission(formData: FormData) {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   // 🔒 Make sure user is logged in
//   if (!user) {
//     return redirect("/api/auth/register");
//   }

//   const title = formData.get("title");
//   const content = formData.get("content");
//   const url = formData.get("url");

//   const data = await prisma.blogPost.create({
//     data: {
//       title: title as string,
//       content: content as string,
//       imageUrl: url as string,
//       authorId: user.id,
//       authorImage: (user?.picture as string) || "https://placehold.co/100",
//       // authorImage: (user.picture as string),
//       authorName: user.given_name as string,
//     },
//   });
//   revalidatePath("/");
//   return redirect("/dashboard");
// }

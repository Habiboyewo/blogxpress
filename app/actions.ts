"use server";

import { z } from "zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/utils/db";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const serverSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  file: z.instanceof(File, { message: "Image is required" }),
});

type FormState = { success?: boolean; error?: string };

async function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "BlogXpress",
          resource_type: "image",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else if (!result) reject(new Error("No result from Cloudinary"));
          else resolve(result);
        }
      )
      .end(buffer);
  });
}

export async function handleSubmission(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const file = formData.get("file") as File;

  const parsed = serverSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    file,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image too large (max 5MB)" };
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Only JPG, PNG or WebP allowed" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadToCloudinary(buffer);

    await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        imageUrl: uploaded.secure_url,
        authorId: user.id,
        authorImage: user.picture ?? "/blogxpressPlaceholder.png",
        authorName: user.given_name ?? "Anonymous",
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Upload failed:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { error: message };
  }
}


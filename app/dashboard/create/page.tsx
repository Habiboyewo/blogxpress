"use client";

import Image from "next/image";
import { useState, ChangeEvent, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { handleSubmission } from "@/app/actions";
import { Submitbutton } from "@/components/ui/Submitbutton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

type FormField = "title" | "content" | "file";
type ActionState = { success?: boolean; error?: string };

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title too long — keep it under 100 characters."),

  content: z.string().trim().min(10, "Content must be at least 10 characters."),

  file: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Image is required.")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Only JPG, PNG, or WebP allowed."
    )
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max image size is 5MB"),
});

export default function CreateRoute() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<Record<FormField, string | undefined>>({
    title: undefined,
    content: undefined,
    file: undefined,
  });

  const [state, formAction] = useActionState<ActionState, FormData>(handleSubmission, {});

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state, router]);


  const handleFieldChange = (field: "title" | "content", value: string) => {
    try {
      formSchema.shape[field].parse(value);
      setClientErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setClientErrors((prev) => ({
          ...prev,
          [field]: err.issues[0].message,
        }));
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setClientErrors((prev) => ({ ...prev, file: "Image is required." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      formSchema.shape.file.parse(file);
      setClientErrors((prev) => ({ ...prev, file: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setClientErrors((prev) => ({ ...prev, file: err.issues[0].message }));
      }
    }
  };

  const isFormValid =
    !clientErrors.title &&
    !clientErrors.content &&
    !clientErrors.file &&
    preview !== null;

  return (
    <div className="py-12 md:py-16 px-4 md:px-0">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>Create a new post to share with the world</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Your Post title..."
                onChange={(e) => handleFieldChange("title", e.target.value)}
                required
              />
              {clientErrors.title && (
                <p className="text-sm text-red-600">{clientErrors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post..."
                className="min-h-48 resize-none"
                onChange={(e) => handleFieldChange("content", e.target.value)}
                required
              />
              {clientErrors.content && (
                <p className="text-sm text-red-600">{clientErrors.content}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="file">Cover Image</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {clientErrors.file && (
                <p className="text-sm text-red-600">{clientErrors.file}</p>
              )}
            </div>

            {preview && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Preview:</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image src={preview} alt="Preview" fill className="object-contain" />
                </div>
              </div>
            )}

            {state?.error && isFormValid && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-medium">Something went wrong</p>
                <p className="mt-1">{state.error}</p>
              </div>
            )}

            <Submitbutton disabled={!isFormValid} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";
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

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  file: z
    .instanceof(File, { message: "Image is required." })
    .refine((f) => f.size > 0, { message: "Image is required." })
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      { message: "Only JPG, PNG, or WebP allowed." }
    )
    .refine((f) => f.size <= 5 * 1024 * 1024, { message: "Max image size is 5MB." }),
});

export default function CreateRoute() {
  const [errors, setErrors] = useState<Record<FormField, string | undefined>>({
    title: undefined,
    content: undefined,
    file: undefined,
  });
  const [preview, setPreview] = useState<string | null>(null);

  // field change handler
  const handleFieldChange = (field: "title" | "content", value: string) => {
    try {
      // Validate each field
      formSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.issues[0].message }));
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setErrors((prev) => ({ ...prev, file: "Image is required." }));
      return;
    }

    //image Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Validate immediately
    try {
      formSchema.shape.file.parse(file);
      setErrors((prev) => ({ ...prev, file: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, file: err.issues[0].message }));
      }
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({ title: undefined, content: undefined, file: undefined });

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File;

    const parsed = formSchema.safeParse({ title, content, file });
    if (!parsed.success) {
      const fieldErrors: Record<FormField, string | undefined> = {
        title: undefined,
        content: undefined,
        file: undefined,
      };
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as FormField;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await handleSubmission(formData);
      event.currentTarget.reset();
      setPreview(null);
      setErrors({ title: undefined, content: undefined, file: undefined });
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Something went wrong.");
    }
  };

  return (
    <div className="py-16">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>Create a new post to share with the world</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                name="title"
                type="text"
                placeholder="Title"
                onChange={(e) => handleFieldChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <Textarea
                name="content"
                placeholder="Content"
                onChange={(e) => handleFieldChange("content", e.target.value)}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Image Upload</Label>
              <Input
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
            </div>

            {preview && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Image Preview:</p>
                <div className="relative w-40 h-40 rounded-md overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            )}

            <Submitbutton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

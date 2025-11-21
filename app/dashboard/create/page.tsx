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


type ActionState = {
  success?: boolean;
  error?: string;
};

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  file: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Image is required.")
    .refine((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type), "Only JPG, PNG, WebP allowed.")
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max 5MB"),
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
      setClientErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setClientErrors(prev => ({ ...prev, [field]: err.issues[0].message }));
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setClientErrors(prev => ({ ...prev, file: "Image is required." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      formSchema.shape.file.parse(file);
      setClientErrors(prev => ({ ...prev, file: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setClientErrors(prev => ({ ...prev, file: err.issues[0].message }));
      }
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
          <form action={formAction} className="flex flex-col gap-6">
          
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input name="title" type="text" placeholder="Enter title" onChange={(e) => handleFieldChange("title", e.target.value)} required />
              {clientErrors.title && <p className="text-red-500 text-sm">{clientErrors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <Textarea
                name="content"
                placeholder="Write your post..."
                className="min-h-40"
                onChange={(e) => handleFieldChange("content", e.target.value)}
                required
              />
              {clientErrors.content && <p className="text-red-500 text-sm">{clientErrors.content}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Image</Label>
              <Input name="file" type="file" accept="image/*" onChange={handleFileChange} required />
              {clientErrors.file && <p className="text-red-500 text-sm">{clientErrors.file}</p>}
            </div>

            {preview && (
              <div >
                <p className="text-sm font-medium text-gray-600">Image Preview:</p>
                <div className="relative w-40 h-40 rounded-md overflow-hidden">
                  <Image src={preview} alt="Preview" fill style={{ objectFit: "contain" }} />
                </div>
              </div>
            )}

            {state?.error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <Submitbutton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

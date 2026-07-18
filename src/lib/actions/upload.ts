"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(filePath, file);

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}

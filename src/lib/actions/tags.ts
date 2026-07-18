"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/lib/types";

export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) return [];
  return data || [];
}

export async function createTag(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("tags")
    .insert({ name, slug })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) return { error: error.message };
  return { data: true };
}

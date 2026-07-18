"use server";

import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/lib/types";

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (error) return { error: error.message };
  return { data: true };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

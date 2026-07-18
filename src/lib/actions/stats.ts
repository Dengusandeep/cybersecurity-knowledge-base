"use server";

import { createClient } from "@/lib/supabase/server";
import type { SiteStats } from "@/lib/types";

export async function getStats(): Promise<SiteStats> {
  const supabase = await createClient();

  const [labs, investigations, projects, notes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true).eq("type", "lab"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true).eq("type", "investigation"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true).eq("type", "project"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true).eq("type", "note"),
  ]);

  const labCount = labs.count || 0;
  const invCount = investigations.count || 0;
  const projCount = projects.count || 0;
  const noteCount = notes.count || 0;

  return {
    labs: labCount,
    investigations: invCount,
    projects: projCount,
    notes: noteCount,
    totalPosts: labCount + invCount + projCount + noteCount,
  };
}

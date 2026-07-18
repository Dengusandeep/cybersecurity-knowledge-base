"use server";

import { createClient } from "@/lib/supabase/server";
import type { PostFilters, PostWithRelations, PostType } from "@/lib/types";

const POSTS_PER_PAGE = 9;

export async function getPosts(filters: PostFilters = {}) {
  const supabase = await createClient();
  const {
    type,
    category,
    platform,
    search,
    page = 1,
    limit = POSTS_PER_PAGE,
  } = filters;

  let query = supabase
    .from("posts")
    .select("*, categories(*), post_tags(tags(*))", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (type) query = query.eq("type", type);
  if (category) query = query.eq("category_id", category);
  if (platform) query = query.eq("platform", platform);
  if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], total: 0 };
  }

  const posts: PostWithRelations[] = (data || []).map((post) => ({
    ...post,
    tags: post.post_tags?.map((pt: { tags: { id: string; name: string; slug: string } }) => pt.tags) || [],
  }));

  return { posts, total: count || 0 };
}

export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(*), post_tags(tags(*))")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    tags: data.post_tags?.map((pt: { tags: { id: string; name: string; slug: string } }) => pt.tags) || [],
  };
}

export async function getAdjacentPosts(
  currentDate: string,
  type: PostType
): Promise<{ prev: PostWithRelations | null; next: PostWithRelations | null }> {
  const supabase = await createClient();

  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, type")
      .eq("published", true)
      .eq("type", type)
      .lt("published_at", currentDate)
      .order("published_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("posts")
      .select("id, title, slug, type")
      .eq("published", true)
      .eq("type", type)
      .gt("published_at", currentDate)
      .order("published_at", { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    prev: prevResult.data as PostWithRelations | null,
    next: nextResult.data as PostWithRelations | null,
  };
}

export async function getRecentPosts(limit = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(*), post_tags(tags(*))")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data || []).map((post) => ({
    ...post,
    tags: post.post_tags?.map((pt: { tags: { id: string; name: string; slug: string } }) => pt.tags) || [],
  })) as PostWithRelations[];
}

export async function getFeaturedProjects(limit = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(*), post_tags(tags(*))")
    .eq("published", true)
    .eq("type", "project")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data || []).map((post) => ({
    ...post,
    tags: post.post_tags?.map((pt: { tags: { id: string; name: string; slug: string } }) => pt.tags) || [],
  })) as PostWithRelations[];
}

// ─── Admin-only mutations ───

export async function getAllPostsAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(*), post_tags(tags(*))")
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data || []).map((post) => ({
    ...post,
    tags: post.post_tags?.map((pt: { tags: { id: string; name: string; slug: string } }) => pt.tags) || [],
  })) as PostWithRelations[];
}

export async function getPostById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(*), post_tags(tags(*))")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    tags: data.post_tags?.map((pt: { tags: { id: string; name: string; slug: string } }) => pt.tags) || [],
  } as PostWithRelations;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const type = formData.get("type") as PostType;
  const platform = formData.get("platform") as string || null;
  const difficulty = formData.get("difficulty") as string || null;
  const categoryId = formData.get("category_id") as string || null;
  const published = formData.get("published") === "true";
  const coverImageUrl = formData.get("cover_image_url") as string || null;
  const tagsJson = formData.get("tags") as string;
  const tagIds: string[] = tagsJson ? JSON.parse(tagsJson) : [];

  const readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      content,
      excerpt,
      cover_image_url: coverImageUrl,
      type,
      platform,
      difficulty,
      category_id: categoryId || null,
      author_id: user.id,
      reading_time: readingTime,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Insert tags
  if (tagIds.length > 0 && post) {
    await supabase
      .from("post_tags")
      .insert(tagIds.map((tagId) => ({ post_id: post.id, tag_id: tagId })));
  }

  return { data: post };
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const type = formData.get("type") as PostType;
  const platform = formData.get("platform") as string || null;
  const difficulty = formData.get("difficulty") as string || null;
  const categoryId = formData.get("category_id") as string || null;
  const published = formData.get("published") === "true";
  const coverImageUrl = formData.get("cover_image_url") as string || null;
  const tagsJson = formData.get("tags") as string;
  const tagIds: string[] = tagsJson ? JSON.parse(tagsJson) : [];

  const readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

  // Get current publish status
  const { data: existing } = await supabase
    .from("posts")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const publishedAt = published && !existing?.published
    ? new Date().toISOString()
    : existing?.published_at;

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      content,
      excerpt,
      cover_image_url: coverImageUrl,
      type,
      platform,
      difficulty,
      category_id: categoryId || null,
      reading_time: readingTime,
      published,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Re-sync tags
  await supabase.from("post_tags").delete().eq("post_id", id);
  if (tagIds.length > 0) {
    await supabase
      .from("post_tags")
      .insert(tagIds.map((tagId) => ({ post_id: id, tag_id: tagId })));
  }

  return { data: { id } };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  return { data: true };
}

// ─── Post Types ───
export type PostType = "lab" | "investigation" | "project" | "note";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Insane";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  type: PostType;
  platform: string | null;
  difficulty: Difficulty | null;
  category_id: string | null;
  author_id: string;
  reading_time: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithRelations extends Post {
  categories: Category | null;
  tags: Tag[];
  post_tags?: { tags: Tag }[];
}

// ─── Contact ───
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// ─── Filters ───
export interface PostFilters {
  type?: PostType;
  category?: string;
  platform?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Stats ───
export interface SiteStats {
  labs: number;
  investigations: number;
  projects: number;
  notes: number;
  totalPosts: number;
}

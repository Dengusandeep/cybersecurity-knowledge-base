"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Upload, ImageIcon } from "lucide-react";
import { getPostById, updatePost } from "@/lib/actions/posts";
import { getCategories } from "@/lib/actions/categories";
import { getTags } from "@/lib/actions/tags";
import { uploadImage } from "@/lib/actions/upload";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import type { Category, Tag, PostWithRelations } from "@/lib/types";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [type, setType] = useState("lab");
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getPostById(id), getCategories(), getTags()]).then(
      ([postData, cats, tags]) => {
        if (postData) {
          setPost(postData);
          setTitle(postData.title);
          setSlug(postData.slug);
          setContent(postData.content);
          setExcerpt(postData.excerpt || "");
          setType(postData.type);
          setPlatform(postData.platform || "");
          setDifficulty(postData.difficulty || "");
          setCategoryId(postData.category_id || "");
          setCoverImageUrl(postData.cover_image_url || "");
          setPublished(postData.published);
          setSelectedTags(postData.tags?.map((t) => t.id) || []);
        }
        setCategories(cats);
        setAllTags(tags);
        setLoaded(true);
      }
    );
  }, [id]);

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((tid) => tid !== tagId) : [...prev, tagId]
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    if ("url" in result) setCoverImageUrl(result.url);
    setUploading(false);
  }

  async function handleSubmit(publish: boolean) {
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("content", content);
    formData.set("excerpt", excerpt);
    formData.set("type", type);
    formData.set("platform", platform);
    formData.set("difficulty", difficulty);
    formData.set("category_id", categoryId);
    formData.set("cover_image_url", coverImageUrl);
    formData.set("published", String(publish));
    formData.set("tags", JSON.stringify(selectedTags));

    const result = await updatePost(id, formData);
    if (result.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/admin/posts");
    }
  }

  if (!loaded) {
    return <p className="text-text-muted">Loading...</p>;
  }

  if (!post) {
    return <p className="text-text-muted">Post not found.</p>;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Edit Post</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-muted outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/50 resize-none" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-text-secondary">Content (Markdown)</label>
              <button onClick={() => setPreview(!preview)} className="flex items-center gap-1.5 text-xs text-accent-light hover:underline">
                <Eye className="h-3.5 w-3.5" />{preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <div className="min-h-[400px] rounded-lg border border-border bg-bg-secondary p-6">
                <MarkdownRenderer content={content} />
              </div>
            ) : (
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20}
                className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-accent/50 resize-y" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-bg-secondary p-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none">
                <option value="lab">Lab</option>
                <option value="investigation">Investigation</option>
                <option value="project">Project</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none">
                <option value="">None</option>
                <option value="TryHackMe">TryHackMe</option>
                <option value="PortSwigger">PortSwigger</option>
                <option value="HackTheBox">HackTheBox</option>
                <option value="Blue Team Labs">Blue Team Labs</option>
                <option value="CTF">CTF</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none">
                <option value="">None</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Insane">Insane</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none">
                <option value="">None</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-secondary p-4">
            <label className="mb-2 block text-sm font-medium text-text-secondary">Cover Image</label>
            {coverImageUrl ? (
              <div className="mb-2">
                <img src={coverImageUrl} alt="Cover" className="w-full rounded-lg border border-border" />
                <button onClick={() => setCoverImageUrl("")} className="mt-1 text-xs text-red-400 hover:underline">Remove</button>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
                <ImageIcon className="h-8 w-8 text-text-muted" />
              </div>
            )}
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
              <Upload className="h-3.5 w-3.5" />{uploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="rounded-xl border border-border bg-bg-secondary p-4">
            <label className="mb-2 block text-sm font-medium text-text-secondary">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button key={tag.id} onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                    selectedTags.includes(tag.id) ? "bg-accent text-white" : "bg-bg-primary text-text-muted hover:text-text-secondary border border-border"
                  }`}>{tag.name}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => handleSubmit(false)} disabled={saving || !title || !content}
              className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-50">
              Save Draft
            </button>
            <button onClick={() => handleSubmit(true)} disabled={saving || !title || !content}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50">
              <Save className="h-3.5 w-3.5" />{published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

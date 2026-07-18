"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { getAllPostsAdmin, deletePost } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";
import type { PostWithRelations } from "@/lib/types";

export default function PostsManagement() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const data = await getAllPostsAdmin();
    setPosts(data);
    setLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = filterType ? posts.filter((p) => p.type === filterType) : posts;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-light"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {["", "lab", "investigation", "project", "note"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filterType === type
                ? "border-accent bg-accent/10 text-accent-light"
                : "border-border text-text-muted hover:text-text-secondary"
            }`}
          >
            {type || "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-text-muted">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-text-muted">No posts found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-5 py-3">Title</th>
                <th className="hidden px-5 py-3 sm:table-cell">Type</th>
                <th className="hidden px-5 py-3 md:table-cell">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((post) => {
                const viewPath =
                  post.type === "lab" ? "/labs" :
                  post.type === "investigation" ? "/investigations" :
                  post.type === "project" ? "/projects" : "/notes";

                return (
                  <tr key={post.id} className="hover:bg-bg-elevated/50">
                    <td className="max-w-xs truncate px-5 py-3 font-medium text-text-primary">
                      {post.title}
                    </td>
                    <td className="hidden px-5 py-3 text-text-muted capitalize sm:table-cell">
                      {post.type}
                    </td>
                    <td className="hidden px-5 py-3 text-text-muted md:table-cell">
                      {post.created_at ? formatDate(post.created_at) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          post.published
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {post.published && (
                          <Link
                            href={`${viewPath}/${post.slug}`}
                            className="rounded p-1 text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded p-1 text-text-muted hover:bg-bg-elevated hover:text-accent-light"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

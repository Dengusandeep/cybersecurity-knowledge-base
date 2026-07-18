"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { getTags, createTag, deleteTag } from "@/lib/actions/tags";
import type { Tag } from "@/lib/types";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getTags().then((data) => {
      setTags(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    const formData = new FormData();
    formData.set("name", name);
    const result = await createTag(formData);
    if (result.data) {
      setTags((prev) => [...prev, result.data as Tag]);
      setName("");
    }
    setCreating(false);
  }

  async function handleDelete(id: string, tagName: string) {
    if (!confirm(`Delete tag "${tagName}"?`)) return;
    await deleteTag(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Tags</h1>

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/50"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-light disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div className="rounded-xl border border-border bg-bg-secondary">
        {loading ? (
          <p className="p-6 text-center text-sm text-text-muted">Loading...</p>
        ) : tags.length === 0 ? (
          <div className="p-6 text-center">
            <TagIcon className="mx-auto mb-2 h-8 w-8 text-text-muted" />
            <p className="text-sm text-text-muted">No tags yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-5">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 rounded-full border border-border bg-bg-primary px-3 py-1.5"
              >
                <span className="text-sm text-text-secondary">{tag.name}</span>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  className="rounded-full p-0.5 text-text-muted hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { getCategories, createCategory, deleteCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    const formData = new FormData();
    formData.set("name", name);
    const result = await createCategory(formData);
    if (result.data) {
      setCategories((prev) => [...prev, result.data as Category]);
      setName("");
    }
    setCreating(false);
  }

  async function handleDelete(id: string, catName: string) {
    if (!confirm(`Delete category "${catName}"?`)) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Categories</h1>

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
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
        ) : categories.length === 0 ? (
          <div className="p-6 text-center">
            <FolderOpen className="mx-auto mb-2 h-8 w-8 text-text-muted" />
            <p className="text-sm text-text-muted">No categories yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{cat.name}</p>
                  <p className="text-xs text-text-muted">{cat.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

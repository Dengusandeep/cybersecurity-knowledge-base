"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string }[];
  platforms?: string[];
}

export default function CategoryFilter({ categories, platforms }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activePlatform = searchParams.get("platform") || "";

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      {/* Platform filter */}
      {platforms && platforms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("platform", "")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              !activePlatform
                ? "border-accent bg-accent/10 text-accent-light"
                : "border-border text-text-muted hover:border-border-light hover:text-text-secondary"
            }`}
          >
            All Platforms
          </button>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setFilter("platform", p)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                activePlatform === p
                  ? "border-accent bg-accent/10 text-accent-light"
                  : "border-border text-text-muted hover:border-border-light hover:text-text-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("category", "")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              !activeCategory
                ? "border-accent bg-accent/10 text-accent-light"
                : "border-border text-text-muted hover:border-border-light hover:text-text-secondary"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter("category", cat.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat.id
                  ? "border-accent bg-accent/10 text-accent-light"
                  : "border-border text-text-muted hover:border-border-light hover:text-text-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

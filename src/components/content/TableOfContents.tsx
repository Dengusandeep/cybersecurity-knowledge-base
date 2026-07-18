"use client";

import { useEffect, useState } from "react";

interface TableOfContentsProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse headings from markdown
    const matches = content.matchAll(/^(#{1,4})\s+(.+)$/gm);
    const items: TocItem[] = [];
    for (const match of matches) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`#]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      items.push({ id, text, level });
    }
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        On This Page
      </h4>
      <ul className="space-y-1 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block border-l-2 py-1 text-sm transition-colors ${
                heading.level === 1 ? "pl-3" : heading.level === 2 ? "pl-3" : heading.level === 3 ? "pl-6" : "pl-9"
              } ${
                activeId === heading.id
                  ? "border-accent text-accent-light"
                  : "border-transparent text-text-muted hover:border-border-light hover:text-text-secondary"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PrevNextNavProps {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  basePath: string;
}

export default function PrevNextNav({ prev, next, basePath }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30 hover:bg-bg-elevated"
        >
          <ChevronLeft className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent-light" />
          <div className="min-w-0">
            <p className="text-xs text-text-muted">Previous</p>
            <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent-light">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-bg-secondary p-4 text-right transition-all hover:border-accent/30 hover:bg-bg-elevated"
        >
          <div className="min-w-0">
            <p className="text-xs text-text-muted">Next</p>
            <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent-light">
              {next.title}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-light" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

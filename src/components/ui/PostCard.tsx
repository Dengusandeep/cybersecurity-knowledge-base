import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { PostWithRelations } from "@/lib/types";
import { formatDate, getDifficultyColor, getPlatformColor } from "@/lib/utils";

interface PostCardProps {
  post: PostWithRelations;
  basePath: string;
}

export default function PostCard({ post, basePath }: PostCardProps) {
  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-bg-secondary p-5 transition-all duration-200 hover:border-accent/30 hover:bg-bg-elevated"
    >
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        {post.platform && (
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${getPlatformColor(post.platform)}`}
          >
            {post.platform}
          </span>
        )}
        {post.difficulty && (
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${getDifficultyColor(post.difficulty)}`}
          >
            {post.difficulty}
          </span>
        )}
        {post.categories && (
          <span className="inline-flex rounded-md border border-border bg-bg-primary px-2 py-0.5 text-xs font-medium text-text-muted">
            {post.categories.name}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-text-primary transition-colors group-hover:text-accent-light">
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mb-4 line-clamp-2 text-sm text-text-muted leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-light"
            >
              #{tag.name}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-text-muted">+{post.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {post.published_at ? formatDate(post.published_at) : "Draft"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.reading_time} min read
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-light" />
      </div>
    </Link>
  );
}

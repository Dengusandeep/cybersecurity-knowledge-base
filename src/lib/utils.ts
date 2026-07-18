import { format, formatDistanceToNow } from "date-fns";

/**
 * Calculate reading time from markdown content.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Generate a URL-safe slug from a title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Format a date string for display.
 */
export function formatDate(date: string): string {
  return format(new Date(date), "MMM d, yyyy");
}

/**
 * Format a date as relative time (e.g. "3 days ago").
 */
export function formatRelativeDate(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Get difficulty color classes.
 */
export function getDifficultyColor(difficulty: string | null): string {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Medium":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Hard":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "Insane":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    default:
      return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  }
}

/**
 * Get platform color classes.
 */
export function getPlatformColor(platform: string | null): string {
  switch (platform) {
    case "TryHackMe":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "PortSwigger":
      return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    case "HackTheBox":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case "Blue Team Labs":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "CTF":
      return "bg-violet-500/15 text-violet-400 border-violet-500/30";
    default:
      return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  }
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

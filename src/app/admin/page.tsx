import Link from "next/link";
import { Plus, FileText, FlaskConical, Search, FolderGit2 } from "lucide-react";
import { getStats } from "@/lib/actions/stats";
import { getRecentPosts } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [stats, recentPosts] = await Promise.all([
    getStats(),
    getRecentPosts(5),
  ]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">Overview of your content</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-light"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FlaskConical, label: "Labs", value: stats.labs, color: "text-blue-400" },
          { icon: Search, label: "Investigations", value: stats.investigations, color: "text-emerald-400" },
          { icon: FolderGit2, label: "Projects", value: stats.projects, color: "text-violet-400" },
          { icon: FileText, label: "Notes", value: stats.notes, color: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-bg-secondary p-5">
            <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-sm text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl border border-border bg-bg-secondary">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-text-primary">Recent Posts</h2>
        </div>
        <div className="divide-y divide-border">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{post.title}</p>
                  <p className="text-xs text-text-muted">
                    {post.type} &middot; {post.published_at ? formatDate(post.published_at) : "Draft"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      post.published
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-xs text-accent-light hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="px-5 py-6 text-center text-sm text-text-muted">
              No posts yet. Create your first post!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

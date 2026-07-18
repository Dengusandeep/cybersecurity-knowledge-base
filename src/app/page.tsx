import Link from "next/link";
import {
  Shield,
  ArrowRight,
  FlaskConical,
  Search,
  FolderGit2,
  FileText,
  Terminal,
} from "lucide-react";
import { getRecentPosts, getFeaturedProjects } from "@/lib/actions/posts";
import { getStats } from "@/lib/actions/stats";
import PostCard from "@/components/ui/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "S_Library — Cybersecurity Knowledge Library",
  description:
    "Personal cybersecurity knowledge library documenting SOC investigations, labs, CTFs, projects, and write-ups.",
};

export default async function HomePage() {
  const [recentPosts, featuredProjects, stats] = await Promise.all([
    getRecentPosts(4),
    getFeaturedProjects(3),
    getStats(),
  ]);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
              <Terminal className="h-3.5 w-3.5 text-accent-light" />
              <span className="text-xs font-medium text-accent-light">
                SOC Analyst &middot; Cybersecurity Learner
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl animate-fade-in-up">
              Cybersecurity
              <br />
              <span className="text-accent">Knowledge Library</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary animate-fade-in-up animate-delay-100">
              Documenting my cybersecurity journey — SOC investigations, lab
              walkthroughs, CTF write-ups, and security research. Built for
              learning, reference, and sharing knowledge.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up animate-delay-200">
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light"
              >
                Explore Labs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-border-light hover:text-text-primary"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-b border-border bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              {
                icon: FlaskConical,
                label: "Labs Completed",
                value: stats.labs,
              },
              {
                icon: Search,
                label: "Investigations",
                value: stats.investigations,
              },
              {
                icon: FolderGit2,
                label: "Projects",
                value: stats.projects,
              },
              {
                icon: FileText,
                label: "Total Write-ups",
                value: stats.totalPosts,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-bg-primary p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <stat.icon className="h-5 w-5 text-accent-light" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest Write-ups ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Latest Write-ups
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Recent labs, investigations, and notes
            </p>
          </div>
          <Link
            href="/labs"
            className="hidden items-center gap-1 text-sm font-medium text-accent-light transition-colors hover:text-accent sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recentPosts.map((post) => {
              const basePath =
                post.type === "lab"
                  ? "/labs"
                  : post.type === "investigation"
                  ? "/investigations"
                  : post.type === "project"
                  ? "/projects"
                  : "/notes";
              return (
                <PostCard key={post.id} post={post} basePath={basePath} />
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-bg-secondary p-12 text-center">
            <Shield className="mx-auto h-10 w-10 text-text-muted" />
            <p className="mt-3 text-text-muted">
              No posts yet. Create your first write-up from the admin panel.
            </p>
          </div>
        )}
      </section>

      {/* ─── Featured Projects ─── */}
      {featuredProjects.length > 0 && (
        <section className="border-t border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Featured Projects
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Security tools, scripts, and research
                </p>
              </div>
              <Link
                href="/projects"
                className="hidden items-center gap-1 text-sm font-medium text-accent-light transition-colors hover:text-accent sm:flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((post) => (
                <PostCard key={post.id} post={post} basePath="/projects" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

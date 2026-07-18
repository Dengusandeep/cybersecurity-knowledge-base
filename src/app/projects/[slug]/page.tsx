import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getAdjacentPosts } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import TableOfContents from "@/components/content/TableOfContents";
import PrevNextNav from "@/components/content/PrevNextNav";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.type !== "project") notFound();

  const { prev, next } = await getAdjacentPosts(post.published_at || post.created_at, "project");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent-light">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="flex gap-10 lg:flex-row flex-col-reverse">
        <article className="min-w-0 flex-1">
          <header className="mb-8">
            {post.categories && (
              <span className="mb-4 inline-block rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium text-text-muted">
                {post.categories.name}
              </span>
            )}
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="mt-3 text-lg text-text-secondary">{post.excerpt}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.published_at ? formatDate(post.published_at) : "Draft"}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.reading_time} min read</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-light">#{tag.name}</span>
                ))}
              </div>
            )}
          </header>

          {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="mb-8 w-full rounded-xl border border-border object-cover" />}

          <MarkdownRenderer content={post.content} />
          <PrevNextNav prev={prev} next={next} basePath="/projects" />
        </article>

        <aside className="hidden w-64 shrink-0 lg:block">
          <TableOfContents content={post.content} />
        </aside>
      </div>
    </div>
  );
}

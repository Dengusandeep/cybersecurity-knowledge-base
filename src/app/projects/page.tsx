import { Suspense } from "react";
import { FolderGit2 } from "lucide-react";
import { getPosts } from "@/lib/actions/posts";
import { getCategories } from "@/lib/actions/categories";
import PostCard from "@/components/ui/PostCard";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilter from "@/components/ui/CategoryFilter";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Cybersecurity projects, security tools, scripts, and research work.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categories = await getCategories();
  const { posts, total } = await getPosts({
    type: "project",
    category: params.category,
    search: params.search,
    page: Number(params.page || "1"),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <FolderGit2 className="h-5 w-5 text-accent-light" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
        </div>
        <p className="text-text-muted">Security tools, scripts, and research projects.</p>
      </div>

      <div className="mb-8 space-y-4">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      {posts.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-text-muted">{total} project{total !== 1 ? "s" : ""} found</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} basePath="/projects" />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination total={total} perPage={9} />
          </Suspense>
        </>
      ) : (
        <div className="rounded-xl border border-border bg-bg-secondary p-12 text-center">
          <FolderGit2 className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-3 text-text-muted">No projects found.</p>
        </div>
      )}
    </div>
  );
}

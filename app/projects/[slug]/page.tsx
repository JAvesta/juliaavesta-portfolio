import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { renderMdx } from "@/lib/mdx";
import { CaseStudy } from "@/components/CaseStudy";

/** Standalone, shareable URL for every case study (/projects/smac-redesign):
 *  good for recruiters, search engines and anyone who prefers a plain page. */
export async function generateStaticParams() {
  return (await getAllProjects()).map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProjectBySlug((await params).slug);
  return p ? { title: `${p.meta.title} · Julia Avesta`, description: p.meta.subtitle } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProjectBySlug((await params).slug);
  if (!p) notFound();
  return (
    <main className="min-h-dvh bg-surface [container-type:inline-size]">
      <a href="/" className="block border-b-2 border-ink px-4 py-3 font-pixel text-sm text-peri">← Back to JuliaOS</a>
      <CaseStudy meta={p.meta}>{await renderMdx(p.body)}</CaseStudy>
    </main>
  );
}

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { ProjectFrontmatterSchema, type ProjectMeta } from "./schema";
import { readingMinutes } from "./reading-time";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

type RawProject = { meta: ProjectMeta; body: string };

/** Read + validate one file. Throws with the file name and every invalid field. */
async function readProject(fileName: string): Promise<RawProject> {
  const source = await fs.readFile(path.join(PROJECTS_DIR, fileName), "utf8");
  const { data, content } = matter(source);
  const parsed = ProjectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`Invalid frontmatter in content/projects/${fileName}:\n${issues}`);
  }
  return { meta: { ...parsed.data, slug: fileName.replace(/\.mdx$/, ""), fileName, readingMinutes: readingMinutes(content) }, body: content };
}

/**
 * Folder scanner: every *.mdx in /content/projects becomes a desktop icon.
 * Drop a new file in the folder and it appears on the desktop on the next build.
 * Files starting with "_" are ignored, so drafts can live next to published work.
 * `cache` dedupes reads within one render pass.
 */
export const getAllProjects = cache(async (): Promise<RawProject[]> => {
  const files = (await fs.readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".mdx") && !f.startsWith("_")).sort();
  const all = await Promise.all(files.map(readProject));
  return all.sort((a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999) || a.meta.fileName.localeCompare(b.meta.fileName));
});

export const getProjectBySlug = cache(async (slug: string): Promise<RawProject | null> => {
  const all = await getAllProjects();
  return all.find((p) => p.meta.slug === slug) ?? null;
});

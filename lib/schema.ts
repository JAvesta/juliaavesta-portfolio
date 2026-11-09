import { z } from "zod";

/**
 * Frontmatter contract for every file in /content/projects/*.mdx.
 * Validated at build time: a typo in a case study fails the build with a
 * readable message instead of rendering a broken window.
 */
export const MetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1), // strings, so "+42%", "7 → 3" and "1 in 3" all work
});

export const ProjectFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    role: z.string().min(1),
    timeline: z.string().min(1),
    company: z.string().min(1),
    /** Path under /public, e.g. "/icons/smac.svg". Shown on the desktop grid and taskbar. */
    appIcon: z.string().startsWith("/", { message: 'appIcon must be a /public path like "/icons/smac.svg"' }),
    metrics: z.array(MetricSchema).default([]),
    tags: z.array(z.string()).default([]),
    /** Optional: desktop/icon order (lower first). Files without it sort after, by name. */
    order: z.number().int().optional(),
  })
  .strict(); // unknown keys are an error, so the schema stays the single source of truth

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

/** What the desktop needs to draw icons and window chrome (no body). */
export type ProjectMeta = ProjectFrontmatter & {
  slug: string; // derived from the filename: smac-redesign.mdx -> "smac-redesign"
  fileName: string; // shown under the desktop icon, e.g. "smac-redesign.mdx"
  readingMinutes: number; // estimated from the MDX body at build time (lib/reading-time.ts)
};

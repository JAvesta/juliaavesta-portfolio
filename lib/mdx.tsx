import "server-only";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";

/**
 * Compile an MDX body to a React Server Component tree.
 * The result is plain React output, so it can be passed as `children` straight
 * into the client-side <Window>, with no MDX runtime shipped to the browser.
 */
export async function renderMdx(body: string) {
  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm] } }, // gfm: tables, strikethrough, autolinks // frontmatter is already parsed + validated in lib/projects.ts
  });
  return content;
}

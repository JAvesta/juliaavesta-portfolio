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
    options: {
      parseFrontmatter: false, // frontmatter is already parsed + validated in lib/projects.ts
      mdxOptions: { remarkPlugins: [remarkGfm] }, // gfm: tables, strikethrough, autolinks
      // v6 strips JS expressions by default. Our components need them (cols={2}, data={[...]}),
      // and the MDX is our own files, so allow expressions but keep the dangerous-code filter on.
      blockJS: false,
      blockDangerousJS: true,
    },
  });
  return content;
}

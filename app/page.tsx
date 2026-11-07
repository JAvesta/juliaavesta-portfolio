import { getAllProjects } from "@/lib/projects";
import { renderMdx } from "@/lib/mdx";
import { CaseStudy } from "@/components/CaseStudy";
import { Desktop, type DesktopProject } from "@/components/desktop/Desktop";

/**
 * Server entry. Scans /content/projects, compiles every case study to React on the
 * server (statically, at build time), and hands the finished trees to the client shell.
 * The browser never downloads an MDX compiler, and closed windows are never mounted.
 */
export default async function Home() {
  const raw = await getAllProjects();
  const projects: DesktopProject[] = await Promise.all(
    raw.map(async ({ meta, body }) => ({ meta, content: <CaseStudy meta={meta}>{await renderMdx(body)}</CaseStudy> })),
  );

  const about = (
    <div className="p-8">
      <h1 className="font-pixel text-3xl font-bold">Hi, I&apos;m Julia!</h1>
      <p className="mt-3 max-w-[60ch] text-[17px] text-muted">UI/UX Designer and Digital Artist. Double-click a file on the desktop to open a case study.</p>
    </div>
  );

  return <Desktop projects={projects} about={about} />;
}

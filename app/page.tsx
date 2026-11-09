import { getAllProjects } from "@/lib/projects";
import { renderMdx } from "@/lib/mdx";
import { CaseStudy } from "@/components/CaseStudy";
import { About } from "@/components/About";
import { getAbout } from "@/lib/about";
import { LOCATION } from "@/lib/weather";
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

  const about = <About data={getAbout()} firstProject={raw[0]?.meta.slug} />;

  return <Desktop projects={projects} about={about} city={LOCATION.label} />;
}

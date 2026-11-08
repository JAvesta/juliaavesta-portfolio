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
    <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/avatar.png"
        alt="Illustrated portrait of Julia: wavy light-brown hair, dark glasses, blushing smile, pink cardigan with a red bow, on a lavender heart-patterned circle"
        width={901}
        height={899}
        className="h-auto w-40 shrink-0 sm:w-48"
      />
      <div>
      <h1 className="font-pixel text-3xl font-bold">Hi, I&apos;m Julia!</h1>
      <p className="mt-3 max-w-[60ch] text-[17px] text-muted">UI/UX Designer and Digital Artist. Double-click a file on the desktop to open a case study.</p>
      </div>
    </div>
  );

  return <Desktop projects={projects} about={about} />;
}

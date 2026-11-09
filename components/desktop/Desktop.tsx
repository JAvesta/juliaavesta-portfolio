"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { ProjectMeta } from "@/lib/schema";
import { WindowManagerProvider } from "./WindowManager";
import { DesktopIcon } from "./DesktopIcon";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { CookieToggle } from "./CookieToggle";

// Easter eggs are loaded after the desktop is interactive, and never on the server.
const Shimeji = dynamic(() => import("./Shimeji").then((m) => m.Shimeji), { ssr: false });

export type DesktopProject = { meta: ProjectMeta; content: ReactNode };

/**
 * The shell. It receives already-rendered case studies (server-compiled MDX) as
 * opaque ReactNodes and only decides *where* they appear: icon grid, windows, taskbar.
 */
export function Desktop({ projects, about }: { projects: DesktopProject[]; about: ReactNode }) {
  const titles: Record<string, { title: string; icon?: string }> = { about: { title: "About_Me.html", icon: "/icons/about.svg" } };
  for (const p of projects) titles[p.meta.slug] = { title: p.meta.fileName, icon: p.meta.appIcon };

  return (
    <WindowManagerProvider initialOpen="about">
      <div className="desk fixed inset-0 overflow-hidden">
        <header className="menubar fixed inset-x-0 top-0 z-[9000] flex h-[var(--menubar)] items-center gap-4 border-b-2 border-ink bg-surface px-3 font-pixel text-[15px]">
          <span className="font-bold text-peri">✦ JuliaOS</span>
        </header>

        {/* Scanned from /content/projects: one icon per .mdx file */}
        <nav aria-label="Desktop" className="absolute top-[calc(var(--menubar)+16px)] bottom-[calc(var(--taskbar)+16px)] left-4 grid grid-flow-col grid-rows-[repeat(auto-fill,96px)] auto-cols-[104px] content-start gap-2 max-md:right-4 max-md:grid-flow-row max-md:grid-rows-none max-md:auto-rows-[96px] max-md:grid-cols-[repeat(auto-fill,104px)] max-md:justify-center">
          <DesktopIcon id="about" label="About_Me.html" icon="/icons/about.svg" />
          {projects.map((p) => (
            <DesktopIcon key={p.meta.slug} id={p.meta.slug} label={p.meta.fileName} icon={p.meta.appIcon} />
          ))}
          <CookieToggle />
        </nav>

        <Window id="about" title="About_Me.html" icon="/icons/about.svg" width={900}>
          {about}
        </Window>
        {projects.map((p) => (
          <Window key={p.meta.slug} id={p.meta.slug} title={p.meta.fileName} icon={p.meta.appIcon} status={<><span className="truncate">{p.meta.company} · {p.meta.timeline}</span><span className="flex-none">{p.meta.readingMinutes} min read</span></>}>
            {p.content}
          </Window>
        ))}

        <Taskbar titles={titles} />
        <Shimeji />
      </div>
    </WindowManagerProvider>
  );
}

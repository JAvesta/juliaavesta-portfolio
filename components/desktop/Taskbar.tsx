"use client";
import { useWindows } from "./WindowManager";

/** Lists open windows in the order they were opened. Click = focus, click the active one = minimize.
 *  Names shrink to "…" and finally to just the icon (container query in globals.css). */
export function Taskbar({ titles }: { titles: Record<string, { title: string; icon?: string }> }) {
  const { state, open, minimize, activeId } = useWindows();
  return (
    <nav className="taskbar fixed inset-x-0 bottom-0 z-[9000] flex h-[var(--taskbar)] items-center gap-1.5 border-t-2 border-ink bg-surface px-2" aria-label="Open windows">
      <button type="button" onClick={() => open("about")} className="flex-none border-2 border-ink bg-lilac-dark px-3 py-1 font-pixel text-sm text-white shadow-[2px_2px_0_var(--color-ink)]">
        ✦<span className="max-sm:hidden"> Start</span>
      </button>
      <div className="flex min-w-0 flex-1 gap-1.5">
        {state.order.map((id) => {
          const meta = titles[id] ?? { title: id };
          const w = state.wins[id];
          const active = activeId === id;
          return (
            <button
              key={id}
              type="button"
              title={meta.title}
              aria-label={meta.title + (w.minimized ? " (minimized)" : "")}
              onClick={() => (active ? minimize(id) : open(id))}
              className={`tb-item flex min-w-[38px] max-w-[210px] flex-[0_1_210px] items-center gap-1.5 overflow-hidden border-2 border-ink px-2 py-1 font-pixel text-[13px] [container-type:inline-size] ${active ? "translate-x-[2px] translate-y-[2px] bg-lav" : "bg-surface shadow-[2px_2px_0_var(--color-ink)]"} ${w.minimized ? "opacity-65" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {meta.icon && <img src={meta.icon} alt="" className="h-4 w-4 flex-none [image-rendering:pixelated]" />}
              <span className="tb-label truncate">{meta.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

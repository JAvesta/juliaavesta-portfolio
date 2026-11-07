"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useWindows, type WinId } from "./WindowManager";
import { useIsMobile } from "./useIsMobile";

/**
 * Generic OS window. It knows nothing about case studies: it takes a title, an icon
 * and children. MDX output (or any React tree) is passed in as children.
 *
 * Desktop: draggable by the title bar, z-ordered by the WindowManager.
 * Mobile (<768px): dragging is off and the window becomes a full-screen sheet that
 * slides up from the bottom, with the same pixel chrome.
 */
export function Window({
  id,
  title,
  icon,
  status,
  width = 1040,
  children,
}: {
  id: WinId;
  title: string;
  icon?: string;
  status?: ReactNode;
  width?: number;
  children: ReactNode;
}) {
  const { state, close, minimize, toggleMax, focus, move, activeId } = useWindows();
  const w = state.wins[id];
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [live, setLive] = useState<{ x: number; y: number } | null>(null); // position while dragging, committed on release

  // a new window gets keyboard focus and starts at the top of its content
  useEffect(() => {
    if (w?.open && !w.minimized) {
      ref.current?.querySelector<HTMLButtonElement>("[data-close]")?.focus({ preventScroll: true });
    }
  }, [w?.open, w?.minimized]);
  useEffect(() => {
    if (w?.open) bodyRef.current?.scrollTo({ top: 0 });
  }, [w?.open]);

  // Esc closes the front window only
  useEffect(() => {
    if (!w?.open || activeId !== id) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target as HTMLElement).closest("input, textarea")) close(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [w?.open, activeId, id, close]);

  // Closed windows are unmounted entirely: no DOM, no iframes, no images loading.
  if (!w?.open) return null;

  const maximized = w.maximized || isMobile;
  const pos = live ?? { x: w.x, y: w.y };

  const onPointerDown = (e: React.PointerEvent) => {
    if (isMobile || w.maximized || (e.target as HTMLElement).closest("button")) return;
    drag.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = drag.current;
    const maxX = window.innerWidth - 80; // keep the title bar grabbable
    const maxY = window.innerHeight - 120;
    setLive({ x: Math.min(Math.max(d.x + e.clientX - d.px, -width + 120), maxX), y: Math.min(Math.max(d.y + e.clientY - d.py, 0), maxY) });
  };
  const onPointerUp = () => {
    if (drag.current && live) move(id, live.x, live.y);
    drag.current = null;
    setLive(null);
  };

  return (
    <section
      ref={ref}
      role="dialog"
      aria-labelledby={`wt-${id}`}
      aria-modal={isMobile || undefined}
      hidden={w.minimized}
      onPointerDown={() => focus(id)}
      className={[
        "win fixed flex flex-col border-2 border-ink bg-surface",
        maximized
          ? "inset-x-0 top-[var(--menubar)] bottom-[var(--taskbar)] max-md:animate-sheet-up max-md:border-x-0"
          : "shadow-[6px_6px_0_rgba(30,27,46,.85)] max-h-[calc(100dvh-var(--menubar)-var(--taskbar)-24px)]",
        activeId === id ? "is-active" : "",
      ].join(" ")}
      style={{ zIndex: w.z, ...(maximized ? {} : { left: pos.x, top: `calc(var(--menubar) + ${pos.y}px)`, width: `min(${width}px, calc(100vw - 32px))`, height: "min(760px, calc(100dvh - var(--menubar) - var(--taskbar) - 48px))" }) }}
    >
      <div
        className={`win-bar flex h-[38px] flex-none touch-none items-center gap-2 border-b-2 border-ink px-2 select-none ${isMobile || w.maximized ? "" : "cursor-move"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => !isMobile && toggleMax(id)}
      >
        <h2 id={`wt-${id}`} className="flex min-w-0 flex-1 items-center gap-2 truncate bg-surface px-2 font-pixel text-[15px] font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {icon && <img src={icon} alt="" className="h-[18px] w-[18px] [image-rendering:pixelated]" />}
          <span className="truncate">{title}</span>
        </h2>
        <WinButton label="Minimize" onClick={() => minimize(id)}>_</WinButton>
        {!isMobile && <WinButton label="Maximize" onClick={() => toggleMax(id)}>□</WinButton>}
        <WinButton label={`Close ${title}`} onClick={() => close(id)} danger data-close>
          ✕
        </WinButton>
      </div>
      <div ref={bodyRef} className="win-body min-h-0 flex-1 overflow-auto overscroll-contain [container-type:inline-size]">
        {children}
      </div>
      {status && <div className="flex h-8 flex-none items-center justify-between gap-3 truncate border-t-2 border-ink px-3 font-pixel text-[13px] text-muted">{status}</div>}
    </section>
  );
}

function WinButton({ label, onClick, danger, children, ...rest }: { label: string; onClick: () => void; danger?: boolean; children: ReactNode; "data-close"?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid h-6 w-6 flex-none place-items-center border-2 border-ink bg-surface font-pixel text-xs leading-none ${danger ? "hover:bg-pink hover:text-white" : "hover:bg-pink-2"}`}
      {...rest}
    >
      {children}
    </button>
  );
}

"use client";
import { useRef } from "react";
import { useWindows } from "./WindowManager";

/** A desktop file icon. Double-click (or Enter) opens it, like a real desktop.
 *  On touch screens a single tap opens it, since double-tap is not a natural gesture there. */
export function DesktopIcon({ id, label, icon }: { id: string; label: string; icon: string }) {
  const { open } = useWindows();
  const pointerType = useRef<string>("mouse");
  return (
    <button
      type="button"
      className="desk-icon group grid w-[104px] justify-items-center gap-1.5 p-1.5 text-center font-pixel text-[12.5px] leading-tight text-ink outline-none"
      onPointerDown={(e) => (pointerType.current = e.pointerType)}
      onClick={() => pointerType.current !== "mouse" && open(id)}
      onDoubleClick={() => open(id)}
      onKeyDown={(e) => e.key === "Enter" && open(id)}
      aria-label={`Open ${label}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={48} height={48} className="h-12 w-12 transition-transform group-hover:-translate-y-0.5 [image-rendering:pixelated]" />
      <span className="px-1 [overflow-wrap:anywhere] group-hover:bg-peri group-hover:text-white group-focus-visible:bg-peri group-focus-visible:text-white">
        {label}
      </span>
    </button>
  );
}

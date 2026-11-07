"use client";
import { useEffect } from "react";
import { startCookie } from "@/lib/cookie-engine";

/**
 * Desktop pets. Cookie runs as a self-contained DOM + requestAnimationFrame engine
 * (lib/cookie-engine.ts) and talks to the shell only through the DOM: it stands on
 * `.taskbar`, and the Cookie.exe icon (#shimeji-icon) switches it on/off.
 * It never touches WindowManager state, so pets can't cause window re-renders.
 * Loaded with next/dynamic (ssr:false) from Desktop.tsx, after the desktop is interactive.
 */
export function Shimeji() {
  useEffect(() => startCookie(), []); // returns the cleanup, so unmount/Fast Refresh leaves nothing behind
  return null;
}

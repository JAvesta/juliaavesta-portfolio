"use client";
import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

/** true below 768px. Uses useSyncExternalStore so it never tears and is SSR-safe
 *  (the server snapshot is `false`; the mobile layout also has a CSS fallback). */
export function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

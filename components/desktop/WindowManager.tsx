"use client";
import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";

/* ------------------------------------------------------------------
   Window state lives here and nowhere else. Windows, icons and the
   taskbar read it through useWindows(); content never touches it.
   ------------------------------------------------------------------ */

export type WinId = string; // a project slug, or a system window id like "about"

export type WinState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  x: number;
  y: number;
};

type State = { wins: Record<WinId, WinState>; topZ: number; order: WinId[] /* taskbar order */ };

type Action =
  | { type: "open"; id: WinId; x: number; y: number }
  | { type: "close"; id: WinId }
  | { type: "minimize"; id: WinId }
  | { type: "toggleMax"; id: WinId }
  | { type: "focus"; id: WinId }
  | { type: "move"; id: WinId; x: number; y: number };

/** Julia's rule: one main window at a time keeps the device light.
 *  Companion windows (image viewer, editors) may sit on top. */
const COMPANIONS = new Set(["viewer"]);

function reducer(s: State, a: Action): State {
  const cur = s.wins[a.id];
  switch (a.type) {
    case "open": {
      const topZ = s.topZ + 1;
      const wins = { ...s.wins };
      if (!COMPANIONS.has(a.id)) {
        for (const [id, w] of Object.entries(wins)) if (id !== a.id && w.open && !COMPANIONS.has(id)) wins[id] = { ...w, open: false, minimized: false };
      }
      wins[a.id] = cur?.open
        ? { ...cur, minimized: false, z: topZ } // already open: restore + raise
        : { open: true, minimized: false, maximized: cur?.maximized ?? false, z: topZ, x: cur?.x ?? a.x, y: cur?.y ?? a.y };
      const order = s.order.includes(a.id) ? s.order : [...s.order, a.id];
      return { wins, topZ, order: order.filter((id) => wins[id]?.open) };
    }
    case "close":
      if (!cur) return s;
      return { ...s, wins: { ...s.wins, [a.id]: { ...cur, open: false, minimized: false } }, order: s.order.filter((id) => id !== a.id) };
    case "minimize":
      if (!cur) return s;
      return { ...s, wins: { ...s.wins, [a.id]: { ...cur, minimized: true } } };
    case "toggleMax":
      if (!cur) return s;
      return { ...s, topZ: s.topZ + 1, wins: { ...s.wins, [a.id]: { ...cur, maximized: !cur.maximized, z: s.topZ + 1 } } };
    case "focus":
      if (!cur || cur.z === s.topZ) return s; // already on top: no re-render
      return { ...s, topZ: s.topZ + 1, wins: { ...s.wins, [a.id]: { ...cur, z: s.topZ + 1, minimized: false } } };
    case "move":
      if (!cur) return s;
      return { ...s, wins: { ...s.wins, [a.id]: { ...cur, x: a.x, y: a.y } } };
  }
}

type Ctx = {
  state: State;
  open: (id: WinId) => void;
  close: (id: WinId) => void;
  minimize: (id: WinId) => void;
  toggleMax: (id: WinId) => void;
  focus: (id: WinId) => void;
  move: (id: WinId, x: number, y: number) => void;
  /** id of the visible window with the highest z (Esc closes it, taskbar highlights it) */
  activeId: WinId | null;
};

const WindowCtx = createContext<Ctx | null>(null);

export function WindowManagerProvider({ children, initialOpen }: { children: ReactNode; initialOpen?: WinId }) {
  const [state, dispatch] = useReducer(reducer, undefined, (): State => {
    if (!initialOpen) return { wins: {}, topZ: 10, order: [] };
    return { wins: { [initialOpen]: { open: true, minimized: false, maximized: false, z: 11, x: 144, y: 24 } }, topZ: 11, order: [initialOpen] };
  });

  const open = useCallback((id: WinId) => {
    // cascade new windows a little so they don't stack exactly on top of each other
    const n = Object.keys(state.wins).length % 6;
    dispatch({ type: "open", id, x: 144 + n * 28, y: 24 + n * 22 }); // clear of the icon column
  }, [state.wins]);

  const api = useMemo<Ctx>(() => {
    let activeId: WinId | null = null;
    let best = -1;
    for (const [id, w] of Object.entries(state.wins)) if (w.open && !w.minimized && w.z > best) { best = w.z; activeId = id; }
    return {
      state,
      open,
      close: (id) => dispatch({ type: "close", id }),
      minimize: (id) => dispatch({ type: "minimize", id }),
      toggleMax: (id) => dispatch({ type: "toggleMax", id }),
      focus: (id) => dispatch({ type: "focus", id }),
      move: (id, x, y) => dispatch({ type: "move", id, x, y }),
      activeId,
    };
  }, [state, open]);

  return <WindowCtx.Provider value={api}>{children}</WindowCtx.Provider>;
}

export function useWindows() {
  const ctx = useContext(WindowCtx);
  if (!ctx) throw new Error("useWindows must be used inside <WindowManagerProvider>");
  return ctx;
}

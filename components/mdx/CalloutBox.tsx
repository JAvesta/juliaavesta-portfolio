import type { ReactNode } from "react";

const STYLES = {
  insight: { label: "Insight", icon: "💡", box: "bg-lav-soft border-peri", tag: "bg-peri" },
  problem: { label: "Problem", icon: "⚠", box: "bg-pink-soft border-pink", tag: "bg-pink" },
  solution: { label: "Solution", icon: "✓", box: "bg-butter-soft border-ink", tag: "bg-ink" },
} as const;

/** <CalloutBox type="insight|problem|solution" title="optional">markdown…</CalloutBox>
 *  The type is spelled out in text (not color alone), so it reads for everyone. */
export function CalloutBox({ type = "insight", title, children }: { type?: keyof typeof STYLES; title?: string; children: ReactNode }) {
  const s = STYLES[type] ?? STYLES.insight;
  return (
    <aside className={`my-6 border-2 p-5 shadow-[4px_4px_0_var(--color-ink)] ${s.box}`} role="note" aria-label={s.label}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`px-2 py-0.5 font-pixel text-xs text-white ${s.tag}`}>
          <span aria-hidden="true">{s.icon} </span>
          {s.label}
        </span>
        {title && <strong className="text-[17px]">{title}</strong>}
      </div>
      <div className="text-[16.5px] leading-relaxed [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}

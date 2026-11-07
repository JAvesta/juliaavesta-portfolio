import type { ReactNode } from "react";
import type { ProjectMeta } from "@/lib/schema";

/** Server component: the frontmatter-driven header + the MDX body.
 *  Used both inside a desktop window and on the standalone /projects/[slug] page. */
export function CaseStudy({ meta, children }: { meta: ProjectMeta; children: ReactNode }) {
  return (
    <article className="case-study mx-auto max-w-[920px] px-[clamp(16px,4cqi,40px)] pt-8 pb-16">
      <p className="text-sm font-bold text-peri">{meta.company}</p>
      <h1 className="mt-2 font-display text-[clamp(30px,5cqi,44px)] leading-[1.12] font-extrabold tracking-tight">{meta.title}</h1>
      <p className="mt-3 max-w-[60ch] text-[clamp(18px,2.4cqi,21px)] leading-snug text-muted">{meta.subtitle}</p>

      <dl className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 border-t-2 border-line pt-5">
        {[["Role", meta.role], ["Timeline", meta.timeline], ["Company", meta.company]].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[13.5px] font-bold text-muted">{k}</dt>
            <dd className="mt-1 text-base">{v}</dd>
          </div>
        ))}
      </dl>

      {meta.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
          {meta.tags.map((t) => (
            <li key={t} className="border-2 border-dashed border-peri px-2.5 py-0.5 font-pixel text-[13px] text-peri">{t}</li>
          ))}
        </ul>
      )}

      {meta.metrics.length > 0 && (
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
          {meta.metrics.map((m) => (
            <div key={m.label} className="border-t-[3px] border-ink pt-3">
              <div className="font-display text-[40px] leading-none font-extrabold tabular-nums">{m.value}</div>
              <div className="mt-1.5 text-[15px] text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mdx mt-10">{children}</div>
    </article>
  );
}

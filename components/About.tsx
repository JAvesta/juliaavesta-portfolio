"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { AboutData } from "@/lib/about";
import { PixelIcon } from "./PixelIcon";
import { useWindows } from "./desktop/WindowManager";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "education", label: "Education" },
  { id: "interests", label: "Interests" },
  { id: "hobbies", label: "Hobbies" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const ICON_BOX = "grid h-10 w-10 shrink-0 place-items-center [&>svg]:max-h-10 [&>svg]:max-w-10 [&>svg]:h-auto [&>svg]:w-auto";

/** About_Me.html: portrait card on the left, tabbed profile on the right, platforms marquee below. */
export function About({ data, firstProject }: { data: AboutData; firstProject?: string }) {
  const [tab, setTab] = useState<TabId>("profile");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { open } = useWindows();

  function onTabKey(e: KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : dir ? (i + dir + TABS.length) % TABS.length : -1;
    if (to < 0) return;
    e.preventDefault();
    setTab(TABS[to].id);
    tabRefs.current[to]?.focus();
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="grid gap-8 p-6 @3xl:grid-cols-[260px_minmax(0,1fr)] @3xl:p-8">
        {/* left: portrait + actions */}
        <div className="mx-auto grid w-full max-w-[260px] content-start gap-4 @3xl:mx-0 @3xl:max-w-none">
          <figure className="m-0 grid border-2 border-ink bg-surface shadow-[4px_4px_0_var(--color-lav)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Illustrated portrait of Julia: wavy light-brown hair, dark glasses, blushing smile, pink cardigan with a red bow, on a lavender heart-patterned circle"
              width={901}
              height={899}
              className="block aspect-square h-auto w-full object-cover"
            />
            <figcaption className="border-t-2 border-ink px-3 py-2.5 text-center font-pixel text-[22px] font-semibold">Julia Avesta</figcaption>
          </figure>
          <div className="flex flex-wrap gap-2.5">
            {firstProject && (
              <PxButton primary onClick={() => open(firstProject)}>▸ See my work</PxButton>
            )}
            {data.email && <PxButton href={`mailto:${data.email}`}>Say hi</PxButton>}
          </div>
        </div>

        {/* right: tabs */}
        <div className="min-w-0">
          <div role="tablist" aria-label="About Julia" className="flex flex-wrap gap-1 pl-3 max-[480px]:pl-0">
            {TABS.map((t, i) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`pt-${t.id}`}
                  aria-controls={`pp-${t.id}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative top-0.5 border-2 border-b-0 border-ink font-pixel text-base max-[480px]:text-[13.5px] ${
                    selected
                      ? "z-10 bg-surface px-4 pt-2 pb-2.5 font-bold text-ink max-[480px]:px-2.5"
                      : "mt-1.5 bg-lav-soft px-4 pt-2 pb-1.5 font-medium text-muted hover:text-ink max-[480px]:px-2.5"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <Panel id="profile" active={tab}>
            <div className="flex flex-wrap items-center justify-between gap-3.5">
              <span className="bg-ink px-4 py-2 font-pixel text-[clamp(18px,2.4vw,24px)] text-paper">{data.role}</span>
              <Socials data={data} />
            </div>
            <p className="m-0 max-w-[64ch] text-base leading-relaxed">{data.bio}</p>
            <div className="flex flex-wrap gap-2">
              {data.chips.filter(Boolean).map((c) => (
                <span key={c} className="border-2 border-dashed border-peri px-2.5 py-0.5 font-pixel text-sm font-semibold text-peri">{c}</span>
              ))}
            </div>
          </Panel>

          <Panel id="education" active={tab}>
            <div className="grid gap-3.5">
              {data.edu.map((e) => (
                <div key={e.title + e.school} className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3.5 border-b-2 border-dotted border-line pb-3.5 last:border-b-0">
                  <span className={ICON_BOX}><PixelIcon name={e.icon} /></span>
                  <div className="grid gap-[3px]">
                    <b className="font-pixel text-[17px] font-semibold leading-snug">{e.title}</b>
                    <span className="text-[15px] leading-snug text-muted">{e.school}</span>
                    {e.note && <em className="text-[14.5px] font-bold not-italic text-pink">{e.note}</em>}
                    {e.desc && <p className="m-0 mt-1 text-[15px] leading-normal text-muted">{e.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {(["interests", "hobbies"] as const).map((k) => (
            <Panel key={k} id={k} active={tab}>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5 p-0">
                {data[k].map((x) => (
                  <li key={x.label} className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3 border-2 border-ink p-3.5 shadow-[3px_3px_0_var(--color-lav-soft)]">
                    <span className={ICON_BOX}><PixelIcon name={x.icon} /></span>
                    <div className="grid min-w-0 gap-1">
                      <b className="pt-0.5 font-pixel text-[17px] font-semibold leading-snug">{x.label}</b>
                      {x.desc && <p className="m-0 text-[15px] leading-normal text-muted">{x.desc}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>

      {data.platforms.length > 0 && <Marquee items={data.platforms} />}
    </div>
  );
}

function Panel({ id, active, children }: { id: TabId; active: TabId; children: ReactNode }) {
  return (
    <div
      role="tabpanel"
      id={`pp-${id}`}
      aria-labelledby={`pt-${id}`}
      hidden={id !== active}
      tabIndex={0}
      className="grid min-h-[250px] content-start gap-4 border-2 border-ink bg-surface p-[22px] shadow-[4px_4px_0_var(--color-lav)]"
    >
      {children}
    </div>
  );
}

function PxButton({ primary, href, onClick, children }: { primary?: boolean; href?: string; onClick?: () => void; children: ReactNode }) {
  const cls = `inline-flex flex-1 items-center justify-center whitespace-nowrap border-2 border-ink px-3 py-2 font-pixel text-[15px] font-semibold shadow-[3px_3px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
    primary ? "bg-pink text-white hover:brightness-110" : "bg-lav-soft text-ink hover:bg-lav"
  }`;
  return href ? <a href={href} className={cls}>{children}</a> : <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

const SOC = "grid h-10 w-10 place-items-center border-2 border-ink bg-surface text-ink hover:bg-pink hover:text-white [&>svg]:h-5 [&>svg]:w-5";

function Socials({ data }: { data: AboutData }) {
  return (
    <div className="flex gap-2">
      {data.linkedin && (
        <a className={SOC} href={data.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 8.5h-3v11h3v-11zM5 3.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM20.5 13c0-2.8-1.5-4.7-4.1-4.7-1.4 0-2.3.7-2.8 1.4V8.5h-3v11h3v-6c0-1.4.8-2.3 2-2.3s1.9.9 1.9 2.3v6h3V13z" /></svg>
        </a>
      )}
      {data.email && (
        <a className={SOC} href={`mailto:${data.email}`} aria-label={`Email ${data.email}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
        </a>
      )}
      {data.behance && (
        <a className={SOC} href={data.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance (opens in a new tab)">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.6 11.4c.9-.4 1.4-1.1 1.4-2.2C10 7.1 8.5 6 6.3 6H2v12h4.5c2.3 0 4-1.1 4-3.4 0-1.5-.7-2.6-1.9-3.2zM4.6 8.1h1.5c.9 0 1.4.4 1.4 1.1 0 .8-.6 1.2-1.4 1.2H4.6V8.1zm1.7 7.8H4.6v-3.3h1.8c1.1 0 1.6.6 1.6 1.6 0 1.1-.7 1.7-1.7 1.7zM15 7h5v1.3h-5zM17.5 9.5c-2.5 0-4.1 1.8-4.1 4.3 0 2.6 1.6 4.3 4.2 4.3 2 0 3.3-1 3.8-2.6h-2.1c-.2.6-.9 1-1.6 1-1.2 0-1.9-.7-1.9-2H22c.2-2.9-1.4-5-4.5-5zm-1.7 3.4c.1-1 .8-1.6 1.7-1.6 1 0 1.6.6 1.7 1.6h-3.4z" /></svg>
        </a>
      )}
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  const set = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((p) => (
        <span key={p} className="flex items-center">
          <span className="px-6 font-pixel text-2xl font-bold whitespace-nowrap text-peri">{p}</span>
          <span className="text-pink" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label="Platforms I've worked on" className="mt-auto border-t-2 border-ink bg-lav-soft py-4">
      <p className="m-0 mb-2 px-6 font-pixel text-sm font-semibold tracking-wide text-muted uppercase">Platforms I&apos;ve worked on</p>
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max">{set(false)}{set(true)}</div>
      </div>
    </section>
  );
}

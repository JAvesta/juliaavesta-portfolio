/** <PrototypeEmbed src="https://www.figma.com/embed?..." caption="…" />
 *  Lazy-loaded iframe, so a heavy Figma file only loads when the reader scrolls to it.
 *  Always offers "Open in new tab", because embeds can be blocked or cramped on phones. */
export function PrototypeEmbed({
  src,
  caption,
  title = "Interactive prototype",
  aspect = "16/10",
}: {
  src: string;
  caption?: string;
  title?: string;
  aspect?: string; // e.g. "9/19" for a phone-sized embed
}) {
  const openHref = src.includes("figma.com/embed") ? decodeURIComponent(new URL(src).searchParams.get("url") ?? src) : src;
  return (
    <figure className="my-8">
      <div className="overflow-hidden border-2 border-ink bg-lav-soft shadow-[4px_4px_0_var(--color-lav)]" style={{ aspectRatio: aspect }}>
        <iframe src={src} title={title} loading="lazy" allowFullScreen className="h-full w-full border-0" />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-[14.5px] text-muted">
        <span>{caption}</span>
        <a href={openHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-peri underline underline-offset-4">
          Open in new tab ↗
        </a>
      </figcaption>
    </figure>
  );
}

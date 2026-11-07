import fs from "node:fs";
import path from "node:path";

/** <Figure src="/projects/deep/title.png" alt="…" caption="…" aspect="16/9" />
 *  Server component. If the file exists in /public it renders the image; if not, it renders
 *  a labelled placeholder (with the alt text), so a case study can ship before every
 *  screenshot is exported. Adding the file later is all it takes: no MDX edit needed. */
export function Figure({ src, alt, caption, aspect = "16/9" }: { src: string; alt: string; caption?: string; aspect?: string }) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", src));
  return (
    <figure className="my-0 min-w-0">
      {exists ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
      ) : (
        <div
          role="img"
          aria-label={`Image placeholder. Planned image: ${alt}`}
          style={{ aspectRatio: aspect }}
          className="grid w-full place-items-center content-center gap-1.5 border-2 border-dashed border-peri bg-lav-soft bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgb(116_102_219/.06)_10px_20px)] p-4 text-center"
        >
          <b className="text-[15px] text-peri" aria-hidden="true">Image coming soon</b>
          {process.env.NODE_ENV !== "production" && (
            <code className="text-xs break-all text-muted" aria-hidden="true">public{src}</code>
          )}
        </div>
      )}
      {caption && <figcaption className="mt-2 text-[14.5px] leading-normal text-muted">{caption}</figcaption>}
    </figure>
  );
}

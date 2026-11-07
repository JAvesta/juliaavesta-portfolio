import type { ReactNode } from "react";

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** <ImageGrid cols={2}> … images … </ImageGrid>
 *  Children are usually markdown images (![alt](/projects/x/a.png)), which render through
 *  the mdx `img` mapping. Collapses to one column on phones. */
/** size="phone" lays tall phone screenshots side by side at a readable width (like the deck). */
export function ImageGrid({ cols = 2, caption, size, children }: { cols?: 1 | 2 | 3 | 4; caption?: string; size?: "phone"; children: ReactNode }) {
  return (
    <figure className="my-8">
      {/* markdown wraps images in <p>; the [&_p] rules flatten that so cells line up evenly */}
      <div className={`grid items-start gap-4 [&_p]:m-0 [&_p]:contents ${size === "phone" ? "grid-cols-[repeat(auto-fill,minmax(160px,240px))]" : COLS[cols] ?? COLS[2]}`}>{children}</div>
      {caption && <figcaption className="mt-2 text-[14.5px] leading-normal text-muted">{caption}</figcaption>}
    </figure>
  );
}

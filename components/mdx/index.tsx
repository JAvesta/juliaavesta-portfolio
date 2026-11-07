import type { MDXComponents } from "mdx/types";
import { StatCallout } from "./StatCallout";
import { ImageGrid } from "./ImageGrid";
import { PrototypeEmbed } from "./PrototypeEmbed";
import { BeforeAfter } from "./BeforeAfter";
import { CalloutBox } from "./CalloutBox";
import { Figure } from "./Figure";
import { DonutChart, BarChart } from "./Charts";

/**
 * Everything an .mdx case study can use without importing.
 * Plain markdown elements get the OS document styling here too, so authors write
 * normal markdown and it still looks like JuliaOS.
 */
export const mdxComponents: MDXComponents = {
  StatCallout,
  ImageGrid,
  PrototypeEmbed,
  BeforeAfterSlider: BeforeAfter, // server wrapper: real slider once both images exist
  CalloutBox,
  Figure,
  DonutChart,
  BarChart,
  h2: (p) => <h2 className="mt-12 mb-3 font-display text-[28px] font-extrabold leading-tight tracking-tight text-ink" {...p} />,
  h3: (p) => <h3 className="mt-8 mb-2 text-xl font-bold leading-snug text-ink" {...p} />,
  p: (p) => <p className="my-4 max-w-[68ch] text-[17px] leading-relaxed text-ink" {...p} />,
  ul: (p) => <ul className="my-4 list-disc space-y-1.5 pl-6 text-[17px]" {...p} />,
  ol: (p) => <ol className="my-4 list-decimal space-y-1.5 pl-6 text-[17px]" {...p} />,
  a: (p) => <a className="font-semibold text-peri underline underline-offset-4 hover:text-pink" target="_blank" rel="noopener noreferrer" {...p} />,
  strong: (p) => <strong className="font-bold" {...p} />,
  blockquote: (p) => <blockquote className="my-6 border-l-4 border-pink bg-pink-soft px-5 py-3 text-[17px]" {...p} />,
  table: (p) => <div className="my-6 overflow-x-auto border-2 border-ink"><table className="w-full border-collapse text-left text-[15.5px]" {...p} /></div>,
  th: (p) => <th className="border-b-2 border-ink bg-lav-soft px-3 py-2 font-bold" {...p} />,
  td: (p) => <td className="border-b border-line px-3 py-2 align-top" {...p} />,
  img: ({ alt = "", ...p }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} loading="lazy" className="block h-auto w-full" {...p} />
  ),
};

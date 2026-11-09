/**
 * Estimated reading time for an MDX case study.
 * Counts the prose plus the text visitors read inside components (captions, titles,
 * labels, stat values), at 220 words a minute, and adds time to look at each image:
 * 12s for the first, one second less for each next one, down to 3s (the Medium approach).
 */
const WPM = 220;
const READ_ATTRS = /\b(?:caption|title|label|value|beforeAlt|afterAlt)=(?:"([^"]*)"|\{"([^"]*)"\})/g;
const IMAGE_TAGS = /<(?:Figure|BeforeAfterSlider|PrototypeEmbed|DonutChart|BarChart)\b|!\[[^\]]*\]\(/g;

export function readingMinutes(mdx: string): number {
  const attrText: string[] = [];
  for (const m of mdx.matchAll(READ_ATTRS)) attrText.push(m[1] ?? m[2] ?? "");

  const prose = mdx
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/<[A-Za-z][^>]*?\/>/gs, " ") // self-closing components (their readable attrs are counted above)
    .replace(/<\/?[A-Za-z][^>]*>/gs, " ") // opening/closing tags, keep children text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // markdown images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/[#>*_|`~-]+/g, " ");

  const words = (prose + " " + attrText.join(" ")).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const images = mdx.match(IMAGE_TAGS)?.length ?? 0;
  let imageSeconds = 0;
  for (let i = 0; i < images; i++) imageSeconds += Math.max(3, 12 - i);

  return Math.max(1, Math.round(words / WPM + imageSeconds / 60));
}

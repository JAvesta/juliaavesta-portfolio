import { PIXEL_COLORS, PIXEL_MAPS, type PixelIconName } from "@/lib/pixel-icons";

/** Crisp pixel-art icon drawn as run-length <rect>s. Decorative by default. */
export function PixelIcon({ name, scale = 3, className, label }: { name: PixelIconName; scale?: number; className?: string; label?: string }) {
  const rows = PIXEL_MAPS[name];
  const h = rows.length;
  const w = rows[0].length;
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const ch = row[x];
      if (ch === ".") { x++; continue; }
      let x2 = x;
      while (x2 < w && row[x2] === ch) x2++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={x2 - x} height={1} fill={PIXEL_COLORS[ch]} />);
      x = x2;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rects}
    </svg>
  );
}

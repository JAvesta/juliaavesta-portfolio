"use client";
import { useId, useState } from "react";

/** <BeforeAfterSlider before="/a.png" after="/b.png" beforeAlt="…" afterAlt="…" />
 *  Drag, click or use the arrow keys: the control is a real <input type="range">,
 *  so it is keyboard and screen-reader accessible for free. */
export function BeforeAfterSlider({
  before,
  after,
  beforeAlt = "Before",
  afterAlt = "After",
  caption,
  aspect = "4/3",
}: {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
  aspect?: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="my-8">
      <div className="relative select-none overflow-hidden border-2 border-ink bg-surface" style={{ aspectRatio: aspect }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt={afterAlt} className="absolute inset-0 h-full w-full object-contain" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={before} alt={beforeAlt} className="h-full w-full object-contain" draggable={false} />
        </div>
        <span className="pointer-events-none absolute top-2 left-2 bg-ink px-2 py-0.5 font-pixel text-xs text-white">Before</span>
        <span className="pointer-events-none absolute top-2 right-2 bg-pink px-2 py-0.5 font-pixel text-xs text-white">After</span>
        <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-pink" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center border-2 border-ink bg-surface font-pixel text-sm">
            ⇆
          </span>
        </div>
        <label htmlFor={id} className="sr-only">
          Compare before and after
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption && <figcaption className="mt-2 text-[14.5px] text-muted">{caption}</figcaption>}
    </figure>
  );
}

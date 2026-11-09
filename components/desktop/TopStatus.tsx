"use client";
import { useEffect, useState } from "react";

type Weather = { ok: true; tempC: number; icon: "sun" | "moon" | "cloud" | "rain"; summary: string } | { ok: false };

const ZONE = "Asia/Manila";
const timeFmt = new Intl.DateTimeFormat("en-PH", { timeZone: ZONE, hour: "numeric", minute: "2-digit", hour12: true });

/* 9×9 pixel glyphs, drawn as one path each */
const GLYPHS: Record<string, { w: number; h: number; d: string }> = {
  pin: { w: 9, h: 11, d: "M2 0h5v1H2zM1 1h1v1H1zM7 1h1v1H7zM0 2h1v4H0zM8 2h1v4H8zM3 3h3v3H3zM1 6h1v2H1zM7 6h1v2H7zM2 8h1v1H2zM6 8h1v1H6zM3 9h1v1H3zM5 9h1v1H5zM4 10h1v1H4z" },
  clock: { w: 9, h: 9, d: "M2 0h5v1H2zM1 1h1v1H1zM7 1h1v1H7zM0 2h1v5H0zM8 2h1v5H8zM1 7h1v1H1zM7 7h1v1H7zM2 8h5v1H2zM4 2h1v3H4zM5 4h2v1H5z" },
  sun: { w: 9, h: 9, d: "M4 0h1v1H4zM1 1h1v1H1zM7 1h1v1H7zM3 2h3v1H3zM2 3h1v3H2zM6 3h1v3H6zM3 3h3v3H3zM0 4h1v1H0zM8 4h1v1H8zM3 6h3v1H3zM1 7h1v1H1zM7 7h1v1H7zM4 8h1v1H4z" },
  moon: { w: 9, h: 9, d: "M3 0h3v1H3zM2 1h1v1H2zM1 2h1v5H1zM2 7h1v1H2zM3 8h4v1H3zM7 7h1v1H7zM8 5h1v2H8zM6 5h2v1H6zM5 4h1v1H5zM4 2h1v2H4zM5 1h1v1H5z" },
  cloud: { w: 10, h: 8, d: "M4 1h3v1H4zM3 2h1v1H3zM7 2h1v2H7zM1 3h2v1H1zM8 3h1v1H8zM0 4h1v2H0zM9 4h1v2H9zM1 6h8v1H1z" },
  rain: { w: 10, h: 10, d: "M4 0h3v1H4zM3 1h1v1H3zM7 1h1v2H7zM1 2h2v1H1zM8 2h1v1H8zM0 3h1v2H0zM9 3h1v2H9zM1 5h8v1H1zM2 7h1v1H2zM5 7h1v1H5zM8 7h1v1H8zM1 9h1v1H1zM4 9h1v1H4zM7 9h1v1H7z" },
};

function Glyph({ name }: { name: keyof typeof GLYPHS }) {
  const g = GLYPHS[name];
  return (
    <svg viewBox={`0 0 ${g.w} ${g.h}`} height={13} width={(13 * g.w) / g.h} shapeRendering="crispEdges" aria-hidden="true" className="flex-none text-peri">
      <path fill="currentColor" d={g.d} />
    </svg>
  );
}

/** Top-bar status: Julia's city, her local time (PHT) and the live temperature there. */
export function TopStatus({ city }: { city: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/weather")
        .then((r) => (r.ok ? r.json() : { ok: false }))
        .then((w: Weather) => alive && setWeather(w))
        .catch(() => alive && setWeather({ ok: false }));
    load();
    const id = setInterval(load, 30 * 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const time = now ? `${timeFmt.format(now).toUpperCase()} PHT` : "";

  return (
    <div className="ml-auto flex items-center gap-4 whitespace-nowrap text-[14px] tabular-nums max-sm:gap-3">
      <span className="inline-flex items-center gap-1.5 max-sm:hidden" title="Where Julia is based">
        <Glyph name="pin" />
        {city}
      </span>
      <span className="inline-flex min-w-[9.5ch] items-center gap-1.5" title="Julia's local time (Philippine Time, UTC+8)">
        <Glyph name="clock" />
        {now && <time dateTime={now.toISOString()} aria-label={`Julia's local time: ${time}`}>{time}</time>}
      </span>
      {weather?.ok && (
        <span className="inline-flex items-center gap-1.5" title={`${weather.summary} in ${city}`} aria-label={`${weather.tempC} degrees Celsius, ${weather.summary.toLowerCase()} in ${city}`}>
          <Glyph name={weather.icon} />
          {weather.tempC}°C
        </span>
      )}
    </div>
  );
}

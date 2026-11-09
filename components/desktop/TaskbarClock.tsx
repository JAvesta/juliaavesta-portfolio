"use client";
import { useEffect, useState } from "react";

const ZONE = "Asia/Manila";
const timeFmt = new Intl.DateTimeFormat("en-PH", { timeZone: ZONE, hour: "numeric", minute: "2-digit", hour12: true });
const fullFmt = new Intl.DateTimeFormat("en-PH", { timeZone: ZONE, weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

/** Taskbar clock showing Julia's local time (Philippine Time), whatever the visitor's own time zone is.
 *  Rendered empty on the server so the static HTML never shows a stale build-time clock. */
export function TaskbarClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()) + 50); // next minute boundary
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex h-[30px] flex-none items-center gap-1.5 border-2 border-ink bg-lav-soft px-2.5 font-pixel text-[13px] whitespace-nowrap tabular-nums shadow-[inset_2px_2px_0_var(--color-lav)]"
      title={now ? `Julia's time: ${fullFmt.format(now)} (Philippine Time, UTC+8)` : undefined}
    >
      {now ? (
        <>
          <time dateTime={now.toISOString()} aria-label={`Julia's local time: ${timeFmt.format(now)} Philippine Time`}>
            {timeFmt.format(now).toUpperCase()}
          </time>
          <span className="text-peri max-[380px]:hidden" aria-hidden="true">PHT</span>
        </>
      ) : (
        <span className="invisible" aria-hidden="true">00:00 AM PHT</span>
      )}
    </div>
  );
}

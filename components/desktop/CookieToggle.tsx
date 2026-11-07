"use client";

/** Cookie.exe on the desktop. The engine owns its on/off state (localStorage "jos-pet",
 *  off by default) and updates this button's label, aria-pressed and ON/OFF badge. */
export function CookieToggle() {
  return (
    <button
      id="shimeji-icon"
      type="button"
      aria-pressed="false"
      className="shimeji desk-icon group grid w-[104px] justify-items-center gap-1.5 p-1.5 text-center font-pixel text-[12.5px] leading-tight text-ink"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/cookie.svg" alt="" width={48} height={42} className="pi h-[42px] w-12 [image-rendering:pixelated]" />
      <span className="px-1 group-hover:bg-peri group-hover:text-white">
        Cookie.exe <b className="sh-state">OFF</b>
      </span>
    </button>
  );
}

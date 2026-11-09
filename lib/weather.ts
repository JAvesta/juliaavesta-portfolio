import "server-only";

/** Where Julia is based: shown in the top bar and used for the weather lookup. */
export const LOCATION = { label: "Manila, PH", lat: 14.5995, lon: 120.9842 };

export type WeatherIcon = "sun" | "moon" | "cloud" | "rain";
export type Weather = { ok: true; tempC: number; icon: WeatherIcon; summary: string } | { ok: false };

/** MET Norway symbol codes → the four pixel icons in the top bar. */
function iconFor(symbol: string): { icon: WeatherIcon; summary: string } {
  if (/rain|sleet|snow|thunder|showers/.test(symbol)) return { icon: "rain", summary: symbol.includes("thunder") ? "Thunderstorms" : "Rain" };
  if (/^(clearsky|fair)/.test(symbol)) return symbol.endsWith("_night") ? { icon: "moon", summary: "Clear night" } : { icon: "sun", summary: "Sunny" };
  if (symbol.startsWith("partlycloudy")) return symbol.endsWith("_night") ? { icon: "moon", summary: "Partly cloudy" } : { icon: "cloud", summary: "Partly cloudy" };
  return { icon: "cloud", summary: symbol.startsWith("fog") ? "Foggy" : "Cloudy" };
}

/**
 * Current temperature from MET Norway (free, no key; their terms ask for an identifying User-Agent).
 * Cached for 30 minutes on the server, so visitors never hit the weather service directly.
 */
export async function getWeather(): Promise<Weather> {
  try {
    const res = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LOCATION.lat}&lon=${LOCATION.lon}`,
      { headers: { "User-Agent": "juliaos-portfolio/1.0 github.com/JAvesta/juliaavesta-portfolio" }, next: { revalidate: 1800 } },
    );
    if (!res.ok) return { ok: false };
    const data = await res.json();
    const now = data?.properties?.timeseries?.[0]?.data;
    const temp = now?.instant?.details?.air_temperature;
    const symbol: string = now?.next_1_hours?.summary?.symbol_code ?? now?.next_6_hours?.summary?.symbol_code ?? "cloudy";
    if (typeof temp !== "number") return { ok: false };
    return { ok: true, tempC: Math.round(temp), ...iconFor(symbol) };
  } catch {
    return { ok: false };
  }
}

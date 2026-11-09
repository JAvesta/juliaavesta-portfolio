import { getWeather } from "@/lib/weather";

export const revalidate = 1800; // refresh the cached answer every 30 minutes

export async function GET() {
  return Response.json(await getWeather());
}

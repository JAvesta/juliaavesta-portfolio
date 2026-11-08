import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { PIXEL_MAPS } from "./pixel-icons";

/**
 * About_Me.html content lives in /content/about.json: edit that file (on GitHub or
 * locally) to change the page. It is validated here so a typo fails the build loudly.
 */
const icon = z.enum(Object.keys(PIXEL_MAPS) as [keyof typeof PIXEL_MAPS, ...(keyof typeof PIXEL_MAPS)[]]);
const item = z.object({ label: z.string().min(1), icon, desc: z.string().optional() }).strict();

export const AboutSchema = z
  .object({
    role: z.string(),
    bio: z.string(),
    chips: z.array(z.string()),
    linkedin: z.string().url().or(z.literal("")),
    email: z.string().email().or(z.literal("")),
    behance: z.string().url().or(z.literal("")),
    edu: z.array(z.object({ title: z.string(), school: z.string(), note: z.string().optional(), icon, desc: z.string().optional() }).strict()),
    interests: z.array(item),
    hobbies: z.array(item),
    platforms: z.array(z.string()),
  })
  .strict();

export type AboutData = z.infer<typeof AboutSchema>;

export function getAbout(): AboutData {
  const file = path.join(process.cwd(), "content", "about.json");
  const parsed = AboutSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
  if (!parsed.success) {
    throw new Error(`content/about.json is invalid:\n${parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n")}`);
  }
  return parsed.data;
}

import { getPlaiceholder } from "plaiceholder";
import { FALLBACK_BLUR } from "./blur-constants";

/** Server-only: generate blur data URL for remote images (e.g. hero, featured). */
export async function getBlurDataURL(imageUrl: string): Promise<string> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return FALLBACK_BLUR;
    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  } catch {
    return FALLBACK_BLUR;
  }
}

export { FALLBACK_BLUR };

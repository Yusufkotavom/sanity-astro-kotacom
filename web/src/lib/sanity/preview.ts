import type { AstroCookies } from "astro";

export const SANITY_DRAFT_COOKIE = "sanity_draft_mode";

export function isDraftModeEnabled(cookies: AstroCookies): boolean {
  return cookies.get(SANITY_DRAFT_COOKIE)?.value === "1";
}

export function resolveDraftRedirect(url: URL): string {
  const redirectTo =
    url.searchParams.get("url") ||
    url.searchParams.get("redirectTo") ||
    url.searchParams.get("redirect") ||
    "/";

  if (!redirectTo.startsWith("/")) return "/";
  return redirectTo;
}

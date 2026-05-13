import { defineMiddleware } from "astro:middleware";
import { getSanityClient } from "@/lib/sanity/client";
import { isDraftModeEnabled } from "@/lib/sanity/preview";
import { REDIRECTS_QUERY } from "@/lib/sanity/queries";

type RedirectItem = {
  source?: string;
  destination?: string;
  permanent?: boolean;
};

let redirectsPromisePublished: Promise<RedirectItem[]> | null = null;
let redirectsPromisePreview: Promise<RedirectItem[]> | null = null;

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

async function getRedirects(preview: boolean): Promise<RedirectItem[]> {
  const client = getSanityClient({ draftMode: preview });
  const cache = preview ? redirectsPromisePreview : redirectsPromisePublished;

  if (!cache) {
    const nextCache = client
      .fetch(REDIRECTS_QUERY)
      .then((items: RedirectItem[] | null) => (Array.isArray(items) ? items : []))
      .catch(() => []);
    if (preview) redirectsPromisePreview = nextCache;
    else redirectsPromisePublished = nextCache;
  }

  return preview ? redirectsPromisePreview! : redirectsPromisePublished!;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = normalizePath(context.url.pathname);

  // Avoid self-redirect loop for framework/system requests.
  if (pathname.startsWith("/_astro") || pathname.startsWith("/api/")) {
    return next();
  }

  // Prerendered routes have no request headers/cookies. Touching
  // `context.cookies` there triggers Astro warnings.
  const preview = context.isPrerendered ? false : isDraftModeEnabled(context.cookies);
  const redirects = await getRedirects(preview);
  const match = redirects.find((item) => normalizePath(item.source || "") === pathname);

  if (!match?.destination) return next();

  const status = match.permanent === false ? 307 : 308;
  return context.redirect(match.destination, status);
});

import type { APIRoute } from "astro";
import { SANITY_DRAFT_COOKIE, resolveDraftRedirect } from "@/lib/sanity/preview";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const redirectTo = resolveDraftRedirect(url);

  cookies.delete(SANITY_DRAFT_COOKIE, { path: "/" });

  return new Response(null, {
    status: 307,
    headers: {
      location: redirectTo,
    },
  });
};

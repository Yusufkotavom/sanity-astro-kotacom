import type { APIRoute } from "astro";
import { SANITY_DRAFT_COOKIE, resolveDraftRedirect } from "@/lib/sanity/preview";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const previewSecret = import.meta.env.SANITY_PREVIEW_SECRET;
  const incomingSecret = url.searchParams.get("secret");

  if (previewSecret && incomingSecret && incomingSecret !== previewSecret) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const redirectTo = resolveDraftRedirect(url);

  cookies.set(SANITY_DRAFT_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: 60 * 60,
  });

  return new Response(null, {
    status: 307,
    headers: {
      location: redirectTo,
    },
  });
};
